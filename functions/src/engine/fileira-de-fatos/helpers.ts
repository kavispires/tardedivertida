// Utils
import utils from '../../utils';
import { FILEIRA_DE_FATOS_ACHIEVEMENTS, FILEIRA_DE_FATOS_PHASES } from './constants';
import type { FileiraDeFatosAchievement, FirebaseStoreData } from './types';

/**
 * Determine the next phase based on the current one
 * @param currentPhase
 * @param round
 * @returns
 */
export const determineNextPhase = (currentPhase: string, round: Round): string => {
  const { RULES, SETUP, ORDERING, RESULTS, GAME_OVER } = FILEIRA_DE_FATOS_PHASES;
  const order = [RULES, SETUP, ORDERING, RESULTS, GAME_OVER];

  if (currentPhase === RESULTS) {
    return round.forceLastRound || (round.current > 0 && round.current === round.total)
      ? GAME_OVER
      : ORDERING;
  }

  const currentPhaseIndex = order.indexOf(currentPhase);

  if (currentPhaseIndex > -1) {
    return order[currentPhaseIndex + 1];
  }
  console.warn('Missing phase check');
  return ORDERING;
};

export const buildRanking = (
  players: Players,
  activePlayerId: PlayerId,
  roundType: string,
  store: FirebaseStoreData,
) => {
  // Gained Points [correct guesses, penalty, perfect kill bonus]
  const scores = new utils.players.Scores(players, [0, 0, 0]);

  const orderKey = players[activePlayerId].currentOrder;
  let correctCount = 0;
  let maxPoints = 0;

  utils.players.getListOfPlayers(players).forEach((player) => {
    if (player.id === activePlayerId) return;
    let playerCorrectCount = 0;

    // First Position
    if (player.currentOrder[0] === orderKey[0]) {
      playerCorrectCount += 1;
      scores.add(player.id, 1, 0);
      utils.achievements.increase(store, player.id, 'first', 1);
    } else {
      if (roundType === 'CURSED_FIRST_POSITION') {
        scores.add(player.id, -1, 1);
      }
    }

    // Second Position
    if (player.currentOrder[1] === orderKey[1]) {
      playerCorrectCount += 1;
      scores.add(player.id, roundType === 'SECOND_POSITION' ? 3 : 1, 0);
      utils.achievements.increase(store, player.id, 'second', 1);
    }

    // Third Position
    if (player.currentOrder[2] === orderKey[2]) {
      playerCorrectCount += 1;
      scores.add(player.id, roundType === 'CENTER_POSITION' ? 3 : 1, 0);
      utils.achievements.increase(store, player.id, 'third', 1);
    }

    // Forth Position
    if (player.currentOrder[3] === orderKey[3]) {
      playerCorrectCount += 1;
      scores.add(player.id, roundType === 'FOURTH_POSITION' ? 3 : 1, 0);
      utils.achievements.increase(store, player.id, 'fourth', 1);
    }

    // Fifth/Final Position
    if (player.currentOrder[4] === orderKey[4]) {
      playerCorrectCount += 1;
      scores.add(player.id, 1, 0);
      utils.achievements.increase(store, player.id, 'fifth', 1);
    } else {
      if (roundType === 'CURSED_LAST_POSITION') {
        scores.add(player.id, -1, 1);
      }
    }

    // Adds player total count for the active player achievement
    correctCount += playerCorrectCount;

    // Perfect kill bonus
    if (playerCorrectCount === 5) {
      scores.add(player.id, 2, 2);
      utils.achievements.increase(store, player.id, 'perfect', 1);
    }

    // If this player score is higher than the max, update it
    if (scores.get(player.id) > maxPoints) {
      maxPoints = scores.get(player.id);
    }
  });

  // Handle active player points
  scores.add(activePlayerId, maxPoints, 0);
  utils.achievements.increase(store, activePlayerId, 'sense', correctCount);

  return scores.rank(players);
};

/**
 * Get achievements
 * @param store
 */
export const getAchievements = (store: FirebaseStoreData) => {
  const achievements: Achievement<FileiraDeFatosAchievement>[] = [];

  const { most, least } = utils.achievements.getMostAndLeastOf(store, 'sense');
  // Got the most correct guesses on their own scenarios
  if (most) {
    achievements.push({
      type: FILEIRA_DE_FATOS_ACHIEVEMENTS.BEST_COMMON_SENSE,
      playerId: most.playerId,
      value: most.value,
    });
  }

  // Got the fewest correct guesses on their own scenarios
  if (least) {
    achievements.push({
      type: FILEIRA_DE_FATOS_ACHIEVEMENTS.WORST_COMMON_SENSE,
      playerId: least.playerId,
      value: least.value,
    });
  }

  const { most: most1, least: fewest1 } = utils.achievements.getMostAndLeastOf(store, 'first');
  // Most correct guesses on the first position
  if (most1) {
    achievements.push({
      type: FILEIRA_DE_FATOS_ACHIEVEMENTS.MOST_FIRST_POSITIONS,
      playerId: most1.playerId,
      value: most1.value,
    });
  }

  // Fewest correct guesses on the first position
  if (fewest1) {
    achievements.push({
      type: FILEIRA_DE_FATOS_ACHIEVEMENTS.FEWEST_FIRST_POSITIONS,
      playerId: fewest1.playerId,
      value: fewest1.value,
    });
  }

  const { most: most2, least: fewest2 } = utils.achievements.getMostAndLeastOf(store, 'second');
  // Most correct guesses on the second position
  if (most2) {
    achievements.push({
      type: FILEIRA_DE_FATOS_ACHIEVEMENTS.MOST_SECOND_POSITIONS,
      playerId: most2.playerId,
      value: most2.value,
    });
  }

  // Fewest correct guesses on the second position
  if (fewest2) {
    achievements.push({
      type: FILEIRA_DE_FATOS_ACHIEVEMENTS.FEWEST_SECOND_POSITIONS,
      playerId: fewest2.playerId,
      value: fewest2.value,
    });
  }

  const { most: most3, least: fewest3 } = utils.achievements.getMostAndLeastOf(store, 'third');
  // Most correct guesses on the third position
  if (most3) {
    achievements.push({
      type: FILEIRA_DE_FATOS_ACHIEVEMENTS.MOST_THIRD_POSITIONS,
      playerId: most3.playerId,
      value: most3.value,
    });
  }

  // Fewest correct guesses on the third position
  if (fewest3) {
    achievements.push({
      type: FILEIRA_DE_FATOS_ACHIEVEMENTS.FEWEST_THIRD_POSITIONS,
      playerId: fewest3.playerId,
      value: fewest3.value,
    });
  }

  const { most: most4, least: fewest4 } = utils.achievements.getMostAndLeastOf(store, 'fourth');
  // Most correct guesses on the fourth position
  if (most4) {
    achievements.push({
      type: FILEIRA_DE_FATOS_ACHIEVEMENTS.MOST_FOURTH_POSITIONS,
      playerId: most4.playerId,
      value: most4.value,
    });
  }

  // Fewest correct guesses on the fourth position
  if (fewest4) {
    achievements.push({
      type: FILEIRA_DE_FATOS_ACHIEVEMENTS.FEWEST_FOURTH_POSITIONS,
      playerId: fewest4.playerId,
      value: fewest4.value,
    });
  }

  const { most: most5, least: fewest5 } = utils.achievements.getMostAndLeastOf(store, 'fifth');
  // Most correct guesses on the fifth position
  if (most5) {
    achievements.push({
      type: FILEIRA_DE_FATOS_ACHIEVEMENTS.MOST_FIFTH_POSITIONS,
      playerId: most5.playerId,
      value: most5.value,
    });
  }

  // Fewest correct guesses on the fifth position
  if (fewest5) {
    achievements.push({
      type: FILEIRA_DE_FATOS_ACHIEVEMENTS.FEWEST_FIFTH_POSITIONS,
      playerId: fewest5.playerId,
      value: fewest5.value,
    });
  }

  // Most correct guesses on the fifth position
  const { most: perfect } = utils.achievements.getMostAndLeastOf(store, 'perfect');
  if (perfect) {
    achievements.push({
      type: FILEIRA_DE_FATOS_ACHIEVEMENTS.PERFECT_GUESS,
      playerId: perfect.playerId,
      value: perfect.value,
    });
  }

  return achievements;
};
