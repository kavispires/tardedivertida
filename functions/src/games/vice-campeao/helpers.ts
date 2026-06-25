import { cloneDeep, groupBy, orderBy, sampleSize, uniq } from 'lodash';
// Types
import type { FirebaseStoreData, RunActivity, RunnerCard } from './types';
// Constants
import { VICE_CAMPEAO_PHASES } from './constants';
// Utils
import utils from '../../utils_LEGACY';
// Internal
import { increaseAchievement } from './achievements';

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

  return utils.game.nextPhaseDelegator(currentPhase, order);
};

type OngoingPlayerEffectsType = Record<string, string | null>;

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
    freeze: null,
    'ongoing-plus-one': null,
    'ongoing-minus-one': null,
  };

  // Order players by ongoing, effect, positive movement, negative movement, ties solved by turn order
  const allPlays = orderBy(
    utils.players.getListOfPlayers(players).map((player) => ({
      playerId: player.id,
      ...cardsDict[player.selectedCardId],
    })),
    [
      (o) =>
        ['ongoing', 'effect', 'movement-positive', 'movement-neutral', 'movement-negative'].indexOf(o.type),
      (o) => turnOrder.indexOf(o.playerId),
    ],
    ['asc', 'asc'],
  );

  // Get all players initial positions
  const initialPositions = utils.players
    .getListOfPlayers(players)
    .reduce((acc: Record<UID, number>, { id, positions }) => {
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
      if (triggerKey === 'freeze') {
        ongoingPlayerEffects.freeze = targetId;
      }
      if (triggerKey === 'ongoing-plus-one') {
        ongoingPlayerEffects['ongoing-plus-one'] = targetId;
      }
      if (triggerKey === 'ongoing-minus-one') {
        ongoingPlayerEffects['ongoing-minus-one'] = targetId;
      }

      return race.push({
        ...baseActivity,
        endingPositions,
      });
    }

    // Movement Cards
    if (['movement-positive', 'movement-negative', 'movement-neutral'].includes(cardType)) {
      const value = play.value || 0;
      if (ongoingPlayerEffects.freeze === targetId) {
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

    // Effect Cards
    // First place (vc-13)
    if (triggerKey === 'first-place') {
      return race.push({
        ...baseActivity,
        endingPositions: triggerEffectFirstPlace(endingPositions, targetId),
      });
    }

    // Last place (vc-14)
    if (triggerKey === 'last-place') {
      return race.push({
        ...baseActivity,
        endingPositions: triggerEffectLastPlace(endingPositions, targetId),
      });
    }

    // Swap (vc-15)
    if (triggerKey === 'swap') {
      return race.push({
        ...baseActivity,
        endingPositions: triggerEffectSwap(endingPositions),
      });
    }

    // Twist (vc-16)
    if (triggerKey === 'twist') {
      return race.push({
        ...baseActivity,
        endingPositions: triggerEffectTwist(endingPositions),
      });
    }

    // Everybody but you go (vc-17)
    if (triggerKey === 'everybody-else-go') {
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
    if (triggerKey === 'everybody-else-back') {
      return race.push({
        ...baseActivity,
        endingPositions: triggerEffectEverybodyElseBack(
          endingPositions,
          targetId,
          getOngoingModifier(ongoingPlayerEffects, targetId),
        ),
      });
    }

    // Russian roulette (vc-19)
    if (triggerKey === 'roulette') {
      const randomTargetId = sampleSize(
        Object.keys(players).filter((pId) => ongoingPlayerEffects.freeze !== pId),
        1,
      )[0];
      return race.push({
        ...baseActivity,
        targetId: randomTargetId,
        endingPositions: triggerEffectLastPlace(endingPositions, randomTargetId),
      });
    }

    if (triggerKey === 'surprise') {
      if (ongoingPlayerEffects.freeze === targetId) {
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
  utils.players.getListOfPlayers(players).forEach((player) => {
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
  if (ongoingPlayerEffects['ongoing-plus-one'] === targetId) {
    return 1;
  }
  if (ongoingPlayerEffects['ongoing-minus-one'] === targetId) {
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
  // Order values
  const orderedPositions = uniq(Object.values(endingPositions).sort((a, b) => a - b));
  const reversedPositions = [...orderedPositions].reverse();
  // Reverse the order of the positions
  Object.entries(endingPositions).forEach(([playerId, currentPosition]) => {
    const currentPositionIndex = orderedPositions.indexOf(currentPosition);
    endingPositions[playerId] = reversedPositions[currentPositionIndex];
  });
  return endingPositions;
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
