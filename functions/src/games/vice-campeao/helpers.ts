import { cloneDeep, groupBy, orderBy, sampleSize, uniq } from 'lodash';
// Types
import type { FirebaseStoreData, RunActivity, RunnerCard } from './types';
// Constants
import { VICE_CAMPEAO_PHASES } from './constants';
// Mechanics
import { getListOfPlayers } from '../../mechanics/players';
import { nextPhaseDelegator } from '../../mechanics/session';
// Internal
import { increaseAchievement } from './achievements';
import { TRIGGER_KEYS } from './data';

/**
 * Determines the next phase based on the current phase and round
 * @param currentPhase - The current phase of the game
 * @param round - The round object containing current round information
 */
export const determineNextPhase = (currentPhase: string, round: Round): string => {
  const { SETUP, CARD_SELECTION, RUN, GAME_OVER } = VICE_CAMPEAO_PHASES;
  const order = [SETUP, CARD_SELECTION, RUN, GAME_OVER];

  if (currentPhase === RUN) {
    if (round.forceLastRound) return GAME_OVER;
    if (round.current > 0 && round.current === round.total) return GAME_OVER;

    return CARD_SELECTION;
  }

  return nextPhaseDelegator(currentPhase, order);
};

type OngoingPlayerEffectsType = {
  [TRIGGER_KEYS.FREEZE]: UID | null;
  [TRIGGER_KEYS.ONGOING_PLUS_ONE]: UID | null;
  [TRIGGER_KEYS.ONGOING_MINUS_ONE]: UID | null;
};

/**
 * Builds the race run sequence by processing all player card plays in order
 * @param players - The collection of players in the game
 * @param cardsDict - The dictionary of runner cards
 * @param turnOrder - The array of player IDs in turn order
 * @param store - The Firebase store data for tracking achievements
 */
export const buildRun = (
  players: Players,
  cardsDict: Dictionary<RunnerCard>,
  turnOrder: UID,
  store: FirebaseStoreData,
) => {
  // Ongoing cards tracking
  const ongoingPlayerEffects: OngoingPlayerEffectsType = {
    [TRIGGER_KEYS.FREEZE]: null,
    [TRIGGER_KEYS.ONGOING_PLUS_ONE]: null,
    [TRIGGER_KEYS.ONGOING_MINUS_ONE]: null,
  };

  // Order players by ongoing, effect, positive movement, negative movement, ties solved by turn order
  const allPlays = orderBy(
    getListOfPlayers(players).map((player) => ({
      playerId: player.id,
      ...cardsDict[player.selectedCardId],
    })),
    [
      (o) =>
        ['ongoing', 'random', 'effect', 'movement-positive', 'movement-neutral', 'movement-negative'].indexOf(
          o.type,
        ),
      (o) => turnOrder.indexOf(o.playerId),
    ],
    ['asc', 'asc'],
  );

  // Get all players initial positions
  const initialPositions = getListOfPlayers(players).reduce((acc: Record<UID, number>, { id, positions }) => {
    acc[id] = positions.at(-1) || 0;
    return acc;
  }, {});

  // Convert all players into run activity
  const race: RunActivity[] = [
    {
      id: -1,
      cardId: '',
      playerId: '',
      targetId: '',
      startingPositions: cloneDeep(initialPositions),
      endingPositions: cloneDeep(initialPositions),
    },
  ];

  // biome-ignore lint/suspicious/useIterableCallbackReturn: return to make it easier to stop the blocks
  allPlays.forEach((play, index) => {
    const startingPositions = cloneDeep(race.at(-1)?.endingPositions || initialPositions);
    const endingPositions = cloneDeep(startingPositions);

    const playerId = play.playerId;
    const targetId = players[playerId].selectedTargetId;
    const cardType = play.type;
    const triggerKey = play.triggerKey;

    // Achievements: Most self cards
    if (playerId === targetId) {
      increaseAchievement(store.achievements, playerId, 'selfCards', 1);
    }

    const baseActivity = {
      id: index,
      cardId: play.id,
      playerId,
      targetId,
      startingPositions,
    };

    // Ongoing Cards
    if (cardType === 'ongoing') {
      if (triggerKey === TRIGGER_KEYS.FREEZE) {
        ongoingPlayerEffects[TRIGGER_KEYS.FREEZE] = targetId;
      }
      if (triggerKey === TRIGGER_KEYS.ONGOING_PLUS_ONE) {
        ongoingPlayerEffects[TRIGGER_KEYS.ONGOING_PLUS_ONE] = targetId;
      }
      if (triggerKey === TRIGGER_KEYS.ONGOING_MINUS_ONE) {
        ongoingPlayerEffects[TRIGGER_KEYS.ONGOING_MINUS_ONE] = targetId;
      }

      increaseAchievement(store.achievements, playerId, 'effects', 1);

      return race.push({
        ...baseActivity,
        endingPositions,
      });
    }

    // Movement Cards
    if (['movement-positive', 'movement-negative', 'movement-neutral'].includes(cardType)) {
      const value = play.value || 0;
      if (ongoingPlayerEffects.FREEZE === targetId) {
        return race.push({
          ...baseActivity,
          endingPositions,
        });
      }

      if (targetId) {
        endingPositions[targetId] = minMaxValue(
          endingPositions[targetId] + value + getOngoingModifier(ongoingPlayerEffects, targetId),
        );
      }

      return race.push({
        ...baseActivity,
        endingPositions,
      });
    }

    increaseAchievement(store.achievements, playerId, 'effects', 1);

    // Effect Cards
    // First place (vc-13)
    if (triggerKey === TRIGGER_KEYS.FIRST_PLACE) {
      return race.push({
        ...baseActivity,
        endingPositions: triggerEffectFirstPlace(endingPositions, targetId),
      });
    }

    // Last place (vc-14)
    if (triggerKey === TRIGGER_KEYS.LAST_PLACE) {
      return race.push({
        ...baseActivity,
        endingPositions: triggerEffectLastPlace(endingPositions, targetId),
      });
    }

    // Swap (vc-15)
    if (triggerKey === TRIGGER_KEYS.SWAP) {
      return race.push({
        ...baseActivity,
        endingPositions: triggerEffectSwap(endingPositions),
      });
    }

    // Twist (vc-16)
    if (triggerKey === TRIGGER_KEYS.INVERSE) {
      return race.push({
        ...baseActivity,
        endingPositions: triggerEffectTwist(endingPositions),
      });
    }

    // Everybody but you go (vc-17)
    if (triggerKey === TRIGGER_KEYS.EVERYBODY_ELSE_GO) {
      return race.push({
        ...baseActivity,
        endingPositions: triggerEffectEveryElseGo(
          endingPositions,
          targetId,
          getOngoingModifier(ongoingPlayerEffects, targetId),
        ),
      });
    }

    // Everybody but you back (vc-18)
    if (triggerKey === TRIGGER_KEYS.EVERYBODY_ELSE_BACK) {
      return race.push({
        ...baseActivity,
        endingPositions: triggerEffectEverybodyElseBack(
          endingPositions,
          targetId,
          getOngoingModifier(ongoingPlayerEffects, targetId),
        ),
      });
    }

    // Reverse Russian roulette (vc-19)
    if (triggerKey === TRIGGER_KEYS.ROULETTE_LAST) {
      const randomTargetId = sampleSize(
        Object.keys(players).filter((pId) => ongoingPlayerEffects.FREEZE !== pId),
        1,
      )[0];
      return race.push({
        ...baseActivity,
        targetId: randomTargetId,
        endingPositions: triggerEffectLastPlace(endingPositions, randomTargetId),
      });
    }

    // Russian roulette (vc-19)
    if (triggerKey === TRIGGER_KEYS.ROULETTE_FIRST) {
      const randomTargetId = sampleSize(
        Object.keys(players).filter((pId) => ongoingPlayerEffects.FREEZE !== pId),
        1,
      )[0];
      return race.push({
        ...baseActivity,
        targetId: randomTargetId,
        endingPositions: triggerEffectFirstPlace(endingPositions, randomTargetId),
      });
    }

    // Champion Roulette (vc-19)
    if (triggerKey === TRIGGER_KEYS.ROULETTE_CHAMPION) {
      const randomTargetId = sampleSize(
        Object.keys(players).filter((pId) => ongoingPlayerEffects.FREEZE !== pId),
        1,
      )[0];
      return race.push({
        ...baseActivity,
        targetId: randomTargetId,
        endingPositions: triggerEffectSecondPlace(endingPositions, randomTargetId),
      });
    }

    if (triggerKey === TRIGGER_KEYS.SURPRISE) {
      if (ongoingPlayerEffects.FREEZE === targetId) {
        return race.push({
          ...baseActivity,
          endingPositions,
        });
      }

      if (targetId) {
        const newValue = sampleSize([1, -1, 2, -2, 3, -3, -4, 4, 5, -5], 1)[0];
        endingPositions[targetId] += newValue + getOngoingModifier(ongoingPlayerEffects, targetId);

        return race.push({
          ...baseActivity,
          newValue,
          endingPositions,
        });
      }
    }

    race.push({
      id: index,
      cardId: play.id,
      playerId,
      targetId,
      startingPositions,
      endingPositions,
    });
  });

  // Achievements
  getListOfPlayers(players).forEach((player) => {
    const currentPosition = player.positions.at(-1) || 0;
    const previousPosition = player.positions.at(-2) || 0;
    const value = currentPosition - previousPosition;

    // Achievements: Most movement
    increaseAchievement(store.achievements, player.id, 'movement', Math.abs(value));

    // Achievements: No movement
    if (value === 0) {
      increaseAchievement(store.achievements, player.id, 'noMovement', 1);
    }
  });

  // Calculate achievements
  const positionsObject = Object.entries(race.at(-1)?.endingPositions ?? {}).map(([playerId, position]) => ({
    playerId,
    position,
  }));
  const tiers = groupBy(positionsObject, 'position');
  const sortedScoreValues = orderBy(Object.keys(tiers), [(o) => Number(o)], ['desc']);
  const ranked = sortedScoreValues.map((score) => tiers[score]);
  // Achievements: First place
  ranked[0].forEach((entry) => {
    increaseAchievement(store.achievements, entry.playerId, 'first', 1);
  });
  // Achievements: Second place
  if (ranked[1]) {
    ranked[1].forEach((entry) => {
      increaseAchievement(store.achievements, entry.playerId, 'second', 1);
    });
  }
  // Achievements: Third place
  if (ranked[2]) {
    ranked[2].forEach((entry) => {
      increaseAchievement(store.achievements, entry.playerId, 'third', 1);
    });
  }

  // Achievements: Last place
  ranked.at(-1)?.forEach((entry) => {
    increaseAchievement(store.achievements, entry.playerId, 'last', 1);
  });

  // Achievements: Second to last place
  if (ranked.at(-2)) {
    ranked.at(-2)?.forEach((entry) => {
      increaseAchievement(store.achievements, entry.playerId, 'secondToLast', 1);
    });
  }

  return race;
};

const minMaxValue = (value: number) => {
  return Math.max(Math.min(value, 20), -10);
};

const getOngoingModifier = (ongoingPlayerEffects: OngoingPlayerEffectsType, targetId: UID) => {
  if (ongoingPlayerEffects[TRIGGER_KEYS.ONGOING_PLUS_ONE] === targetId) {
    return 1;
  }
  if (ongoingPlayerEffects[TRIGGER_KEYS.ONGOING_MINUS_ONE] === targetId) {
    return -1;
  }
  return 0;
};

const triggerEffectFirstPlace = (endingPositions: Record<UID, number>, targetId: UID) => {
  // Get the first place player
  const orderedPositions = Object.values(endingPositions).sort((a, b) => b - a);
  // Move the targetId to the first place
  endingPositions[targetId] = minMaxValue(orderedPositions[0] + 1);
  return endingPositions;
};

const triggerEffectLastPlace = (endingPositions: Record<UID, number>, targetId: UID) => {
  // Get the last place player
  const orderedPositions = Object.values(endingPositions).sort((a, b) => a - b);
  // Move the targetId to the last place
  endingPositions[targetId] = minMaxValue(orderedPositions[0] - 1);
  return endingPositions;
};

const triggerEffectSecondPlace = (endingPositions: Record<UID, number>, targetId: UID) => {
  // Get the first place player
  const orderedPositions = Object.values(endingPositions).sort((a, b) => b - a);
  // Move the targetId to the second place
  endingPositions[targetId] = minMaxValue(orderedPositions[1] + 1);
  return endingPositions;
};

const triggerEffectSwap = (endingPositions: Record<UID, number>) => {
  // Get the first place player
  const orderedPositions = uniq(Object.values(endingPositions).sort((a, b) => b - a));
  const firstPlace = Object.keys(endingPositions).filter(
    (key) => endingPositions[key] === orderedPositions[0],
  );
  const lastPlace = Object.keys(endingPositions).filter(
    (key) => endingPositions[key] === orderedPositions.at(-1),
  );

  // Swap the first place with the last place
  firstPlace.forEach((playerId) => {
    endingPositions[playerId] = orderedPositions.at(-1) ?? 0;
  });

  lastPlace.forEach((playerId) => {
    endingPositions[playerId] = orderedPositions[0];
  });

  return endingPositions;
};

const triggerEffectTwist = (endingPositions: Record<UID, number>) => {
  // Create a copy to avoid mutation conflicts
  const newPositions = { ...endingPositions };

  // Get unique position values sorted ascending
  const orderedPositions = uniq(Object.values(endingPositions).sort((a, b) => a - b));
  const reversedPositions = [...orderedPositions].reverse();

  // Create a mapping of old position -> new position
  const positionMap = orderedPositions.reduce((acc: Record<number, number>, pos, index) => {
    acc[pos] = reversedPositions[index];
    return acc;
  }, {});

  // Apply the mapping to all players
  Object.keys(endingPositions).forEach((playerId) => {
    newPositions[playerId] = positionMap[endingPositions[playerId]];
  });

  return newPositions;
};

const triggerEffectEveryElseGo = (endingPositions: Record<UID, number>, targetId: UID, modifier: number) => {
  Object.keys(endingPositions).forEach((id) => {
    if (id !== targetId) {
      endingPositions[id] = minMaxValue(endingPositions[id] + 1 + modifier);
    }
  });
  return endingPositions;
};

const triggerEffectEverybodyElseBack = (
  endingPositions: Record<UID, number>,
  targetId: UID,
  modifier: number,
) => {
  Object.keys(endingPositions).forEach((id) => {
    if (id !== targetId) {
      endingPositions[id] = minMaxValue(endingPositions[id] - 1 + modifier);
    }
  });
  return endingPositions;
};

export const getCardIdentifierKey = (card: RunnerCard) => {
  if (card.type.startsWith('movement')) {
    return `movement-${card.value}`;
  }
  return card.type;
};
