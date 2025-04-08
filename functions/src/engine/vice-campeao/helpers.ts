// Utils
import { cloneDeep, orderBy } from 'lodash';
import utils from '../../utils';
import { VICE_CAMPEAO_PHASES } from './constants';
import type { FirebaseStoreData, RunActivity, RunnerCard } from './types';

/**
 * Determine the next phase based on the current one
 * @param currentPhase
 * @param round
 * @returns
 */
export const determineNextPhase = (currentPhase: string, round: Round): string => {
  const { RULES, SETUP, CARD_SELECTION, RUN, GAME_OVER } = VICE_CAMPEAO_PHASES;
  const order = [RULES, SETUP, CARD_SELECTION, RUN, GAME_OVER];

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
  _store: FirebaseStoreData,
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
