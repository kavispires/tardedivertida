// Utils
import { cloneDeep, groupBy, orderBy } from 'lodash';
import utils from '../../utils';
import { VICE_CAMPEAO_ACHIEVEMENTS, VICE_CAMPEAO_PHASES } from './constants';
import type { FirebaseStoreData, RunActivity, RunnerCard, ViceCampeaoAchievement } from './types';

/**
 * Determine the next phase based on the current one
 * @param currentPhase
 * @param round
 * @returns
 */
export const determineNextPhase = (currentPhase: string, round: Round): string => {
  const { LOBBY, SETUP, CARD_SELECTION, RUN, GAME_OVER } = VICE_CAMPEAO_PHASES;
  const order = [LOBBY, SETUP, CARD_SELECTION, RUN, GAME_OVER];

  if (currentPhase === RUN) {
    if (round.forceLastRound) return GAME_OVER;
    if (round.current > 0 && round.current === round.total) return GAME_OVER;

    return CARD_SELECTION;
  }

  const currentPhaseIndex = order.indexOf(currentPhase);

  if (currentPhaseIndex > -1) {
    return order[currentPhaseIndex + 1];
  }
  utils.helpers.warnMissingPhase(currentPhase);
  return CARD_SELECTION;
};

type OngoingPlayerEffectsType = Record<string, string | null>;

export const buildRun = (
  players: Players,
  cardsDict: Dictionary<RunnerCard>,
  turnOrder: PlayerId,
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
    .reduce((acc: Record<PlayerId, number>, { id, positions }) => {
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

  allPlays.forEach((play, index) => {
    const startingPositions = cloneDeep(race.at(-1)?.endingPositions || initialPositions);
    const endingPositions = cloneDeep(startingPositions);

    const playerId = play.playerId;
    const targetId = players[playerId].selectedTargetId;
    const cardType = play.type;
    const triggerKey = play.triggerKey;

    // Achievements: Most self cards
    if (playerId === targetId) {
      utils.achievements.increase(store, playerId, 'selfCards', 1);
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
      const randomTargetId = utils.game.getRandomItem(
        Object.keys(players).filter((pId) => ongoingPlayerEffects.freeze !== pId),
      );
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
        const newValue = utils.game.getRandomItem([1, -1, 2, -2, 3, -3, -4, 4, 5, -5]);
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
    utils.achievements.increase(store, player.id, 'movement', Math.abs(value));

    // Achievements: No movement
    if (value === 0) {
      utils.achievements.increase(store, player.id, 'noMovement', 1);
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
    utils.achievements.increase(store, entry.playerId, 'first', 1);
  });
  // Achievements: Second place
  if (ranked[1]) {
    ranked[1].forEach((entry) => {
      utils.achievements.increase(store, entry.playerId, 'second', 1);
    });
  }
  // Achievements: Third place
  if (ranked[2]) {
    ranked[2].forEach((entry) => {
      utils.achievements.increase(store, entry.playerId, 'third', 1);
    });
  }

  // Achievements: Last place
  ranked.at(-1)?.forEach((entry) => {
    utils.achievements.increase(store, entry.playerId, 'last', 1);
  });

  // Achievements: Second to last place
  if (ranked.at(-2)) {
    ranked.at(-2)?.forEach((entry) => {
      utils.achievements.increase(store, entry.playerId, 'secondToLast', 1);
    });
  }

  return race;
};

const minMaxValue = (value: number) => {
  return Math.max(Math.min(value, 20), -10);
};

const getOngoingModifier = (ongoingPlayerEffects: OngoingPlayerEffectsType, targetId: PlayerId) => {
  if (ongoingPlayerEffects['ongoing-plus-one'] === targetId) {
    return 1;
  }
  if (ongoingPlayerEffects['ongoing-minus-one'] === targetId) {
    return -1;
  }
  return 0;
};

const triggerEffectFirstPlace = (endingPositions: Record<PlayerId, number>, targetId: PlayerId) => {
  // Get the first place player
  const orderedPositions = Object.values(endingPositions).sort((a, b) => b - a);
  // Move the targetId to the first place
  endingPositions[targetId] = minMaxValue(orderedPositions[0] + 1);
  return endingPositions;
};

const triggerEffectLastPlace = (endingPositions: Record<PlayerId, number>, targetId: PlayerId) => {
  // Get the last place player
  const orderedPositions = Object.values(endingPositions).sort((a, b) => a - b);
  // Move the targetId to the last place
  endingPositions[targetId] = minMaxValue(orderedPositions[0] - 1);
  return endingPositions;
};

const triggerEffectSwap = (endingPositions: Record<PlayerId, number>) => {
  // Get the first place player
  const orderedPositions = utils.game.removeDuplicates(Object.values(endingPositions).sort((a, b) => b - a));
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

const triggerEffectTwist = (endingPositions: Record<PlayerId, number>) => {
  // Order values
  const orderedPositions = utils.game.removeDuplicates(Object.values(endingPositions).sort((a, b) => a - b));
  const reversedPositions = [...orderedPositions].reverse();
  // Reverse the order of the positions
  Object.entries(endingPositions).forEach(([playerId, currentPosition]) => {
    const currentPositionIndex = orderedPositions.indexOf(currentPosition);
    endingPositions[playerId] = reversedPositions[currentPositionIndex];
  });
  return endingPositions;
};

const triggerEffectEveryElseGo = (
  endingPositions: Record<PlayerId, number>,
  targetId: PlayerId,
  modifier: number,
) => {
  Object.keys(endingPositions).forEach((id) => {
    if (id !== targetId) {
      endingPositions[id] = minMaxValue(endingPositions[id] + 1 + modifier);
    }
  });
  return endingPositions;
};

const triggerEffectEverybodyElseBack = (
  endingPositions: Record<PlayerId, number>,
  targetId: PlayerId,
  modifier: number,
) => {
  Object.keys(endingPositions).forEach((id) => {
    if (id !== targetId) {
      endingPositions[id] = minMaxValue(endingPositions[id] - 1 + modifier);
    }
  });
  return endingPositions;
};

/**
 * Get achievements
 * @param store
 */
export const getAchievements = (store: FirebaseStoreData) => {
  const achievements: Achievement<ViceCampeaoAchievement>[] = [];

  // Most first place
  const { most: mostFirstPlace } = utils.achievements.getMostAndLeastOf(store, 'first');
  if (mostFirstPlace) {
    achievements.push({
      type: VICE_CAMPEAO_ACHIEVEMENTS.MOST_FIRST_PLACE,
      playerId: mostFirstPlace.playerId,
      value: mostFirstPlace.value,
    });
  }

  // Most second place
  const { most: mostSecondPlace } = utils.achievements.getMostAndLeastOf(store, 'second');
  if (mostSecondPlace) {
    achievements.push({
      type: VICE_CAMPEAO_ACHIEVEMENTS.MOST_SECOND_PLACE,
      playerId: mostSecondPlace.playerId,
      value: mostSecondPlace.value,
    });
  }

  // Most third place
  const { most: mostThirdPlace } = utils.achievements.getMostAndLeastOf(store, 'third');
  if (mostThirdPlace) {
    achievements.push({
      type: VICE_CAMPEAO_ACHIEVEMENTS.MOST_THIRD_PLACE,
      playerId: mostThirdPlace.playerId,
      value: mostThirdPlace.value,
    });
  }

  // Most last place
  const { most: mostLastPlace } = utils.achievements.getMostAndLeastOf(store, 'last');
  if (mostLastPlace) {
    achievements.push({
      type: VICE_CAMPEAO_ACHIEVEMENTS.MOST_LAST_PLACE,
      playerId: mostLastPlace.playerId,
      value: mostLastPlace.value,
    });
  }

  // Most second to last place
  const { most: mostSecondToLastPlace } = utils.achievements.getMostAndLeastOf(store, 'secondToLast');
  if (mostSecondToLastPlace) {
    achievements.push({
      type: VICE_CAMPEAO_ACHIEVEMENTS.MOST_SECOND_TO_LAST_PLACE,
      playerId: mostSecondToLastPlace.playerId,
      value: mostSecondToLastPlace.value,
    });
  }

  // Most no movement
  const { most: mostNoMovement } = utils.achievements.getMostAndLeastOf(store, 'noMovement');
  if (mostNoMovement) {
    achievements.push({
      type: VICE_CAMPEAO_ACHIEVEMENTS.MOST_NO_MOVEMENT,
      playerId: mostNoMovement.playerId,
      value: mostNoMovement.value,
    });
  }

  // Most self cards and most other cards
  const { most: mostSelfCards, least: mostOtherCards } = utils.achievements.getMostAndLeastOf(
    store,
    'selfCards',
  );
  if (mostSelfCards) {
    achievements.push({
      type: VICE_CAMPEAO_ACHIEVEMENTS.MOST_SELF_CARDS,
      playerId: mostSelfCards.playerId,
      value: mostSelfCards.value,
    });
  }
  if (mostOtherCards) {
    achievements.push({
      type: VICE_CAMPEAO_ACHIEVEMENTS.MOST_OTHER_CARDS,
      playerId: mostOtherCards.playerId,
      value: mostOtherCards.value,
    });
  }

  // Most movement
  const { most: mostMovement, least: leastMovement } = utils.achievements.getMostAndLeastOf(
    store,
    'movement',
  );
  if (mostMovement) {
    achievements.push({
      type: VICE_CAMPEAO_ACHIEVEMENTS.MOST_MOVEMENT,
      playerId: mostMovement.playerId,
      value: mostMovement.value,
    });
  }
  if (leastMovement) {
    achievements.push({
      type: VICE_CAMPEAO_ACHIEVEMENTS.LEAST_MOVEMENT,
      playerId: leastMovement.playerId,
      value: leastMovement.value,
    });
  }

  return achievements;
};
