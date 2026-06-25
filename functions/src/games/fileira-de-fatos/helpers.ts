// Types
import type { FirebaseStoreData } from './types';
// Constants
import { FILEIRA_DE_FATOS_PHASES } from './constants';
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
  const { SETUP, ORDERING, RESULTS, GAME_OVER } = FILEIRA_DE_FATOS_PHASES;
  const order = [SETUP, ORDERING, RESULTS, GAME_OVER];

  if (currentPhase === RESULTS) {
    return round.forceLastRound || (round.current > 0 && round.current === round.total)
      ? GAME_OVER
      : ORDERING;
  }

  return utils.game.nextPhaseDelegator(currentPhase, order);
};

/**
 * Builds player rankings by comparing their orders to the active player's order
 * @param players - The collection of players in the game
 * @param activePlayerId - The ID of the active player whose order is correct
 * @param roundType - The type of round determining special scoring rules
 * @param store - The Firebase store data for tracking achievements
 */
export const buildRanking = (
  players: Players,
  activePlayerId: UID,
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
      increaseAchievement(store.achievements, player.id, 'first', 1);
    } else {
      if (roundType === 'CURSED_FIRST_POSITION') {
        scores.add(player.id, -1, 1);
      }
    }

    // Second Position
    if (player.currentOrder[1] === orderKey[1]) {
      playerCorrectCount += 1;
      scores.add(player.id, roundType === 'SECOND_POSITION' ? 3 : 1, 0);
      increaseAchievement(store.achievements, player.id, 'second', 1);
    }

    // Third Position
    if (player.currentOrder[2] === orderKey[2]) {
      playerCorrectCount += 1;
      scores.add(player.id, roundType === 'CENTER_POSITION' ? 3 : 1, 0);
      increaseAchievement(store.achievements, player.id, 'third', 1);
    }

    // Forth Position
    if (player.currentOrder[3] === orderKey[3]) {
      playerCorrectCount += 1;
      scores.add(player.id, roundType === 'FOURTH_POSITION' ? 3 : 1, 0);
      increaseAchievement(store.achievements, player.id, 'fourth', 1);
    }

    // Fifth/Final Position
    if (player.currentOrder[4] === orderKey[4]) {
      playerCorrectCount += 1;
      scores.add(player.id, 1, 0);
      increaseAchievement(store.achievements, player.id, 'fifth', 1);
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
      increaseAchievement(store.achievements, player.id, 'perfect', 1);
    }

    // If this player score is higher than the max, update it
    if (scores.get(player.id) > maxPoints) {
      maxPoints = scores.get(player.id);
    }
  });

  // Handle active player points
  scores.add(activePlayerId, maxPoints, 0);
  increaseAchievement(store.achievements, activePlayerId, 'sense', correctCount);

  return scores.rank(players);
};
