import { getNextPhase } from '.';
// Types
import type { ClueId } from './types';
// Services
import { updatePlayer, updateState } from '../../services/game-session';

/**
 * Submits the boss player ID for the round
 * @param gameName - The name of the game
 * @param gameId - The game session ID
 * @param playerId - The player ID submitting the boss selection
 * @param bossId - The selected boss player ID
 */
export const handleSubmitBossPlayer = async (
  gameName: string,
  gameId: UID,
  playerId: UID,
  bossId: string,
) => {
  return await updateState({
    gameName,
    gameId,
    playerId,
    actionText: 'submit boss player id',
    change: {
      bossId,
    },
    nextPhaseFunction: getNextPhase,
  });
};

/**
 * Submits the secret word and associated categories
 * @param gameName - The name of the game
 * @param gameId - The game session ID
 * @param playerId - The boss player ID submitting the word
 * @param secretWord - The secret word string
 * @param categories - Array of category strings
 */
export const handleSubmitSecretWord = async (
  gameName: string,
  gameId: UID,
  playerId: UID,
  secretWord: string,
  categories: string[],
) => {
  return await updateState({
    gameName,
    gameId,
    playerId,
    actionText: 'submit secret word and categories',
    change: {
      secretWord,
      categories,
    },
    nextPhaseFunction: getNextPhase,
  });
};

/**
 * Submits player's clues and optional guesses
 * @param gameName - The name of the game
 * @param gameId - The game session ID
 * @param playerId - The player ID submitting clues
 * @param clues - Array of clue strings
 * @param [guesses] - Optional array of guess strings
 */
export const handleSubmitPlayerClues = async (
  gameName: string,
  gameId: UID,
  playerId: UID,
  clues: string[],
  guesses?: string[],
) => {
  return await updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit clues',
    shouldReady: true,
    change: { clues, guesses },
    nextPhaseFunction: getNextPhase,
  });
};

/**
 * Submits the boss's evaluation of submitted clues
 * @param gameName - The name of the game
 * @param gameId - The game session ID
 * @param playerId - The boss player ID submitting evaluation
 * @param evaluation - Dictionary mapping clue IDs to validity (boolean)
 */
export const handleSubmitEvaluation = async (
  gameName: string,
  gameId: UID,
  playerId: UID,
  evaluation: Record<ClueId, boolean>,
) => {
  // Count trues
  const trues = Object.values(evaluation).filter((result) => result).length;

  return await updateState({
    gameName,
    gameId,
    playerId,
    actionText: 'submit evaluation',
    change: {
      currentEvaluation: trues,
      currentClues: evaluation,
    },
    nextPhaseFunction: getNextPhase,
  });
};

/**
 * Submits the outcome of the guessing phase
 * @param gameName - The name of the game
 * @param gameId - The game session ID
 * @param playerId - The player ID submitting the outcome
 * @param outcome - The outcome string
 */
export const handleSubmitOutcome = async (gameName: string, gameId: UID, playerId: UID, outcome: string) => {
  return await updateState({
    gameName,
    gameId,
    playerId,
    actionText: 'submit outcome',
    change: {
      outcome,
    },
    nextPhaseFunction: getNextPhase,
  });
};

/**
 * Submits a request to use a helper for a specific clue
 * @param gameName - The name of the game
 * @param gameId - The game session ID
 * @param playerId - The player ID requesting help
 * @param clueId - The clue ID to resolve with help
 */
export const handleSubmitHelp = async (gameName: string, gameId: UID, playerId: UID, clueId: ClueId) => {
  return await updateState({
    gameName,
    gameId,
    playerId,
    actionText: 'submit help',
    change: {
      usedHelper: true,
      [`clues.${clueId}.isResolved`]: true,
    },
    nextPhaseFunction: getNextPhase,
  });
};
