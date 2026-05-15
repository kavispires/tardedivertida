// Helpers
import utils from '../../utils';
// Internal functions
import { getNextPhase } from './index';
import type { Guess } from './types';

/**
 * Submits the pool of items and secret word for the round
 * @param gameName - The name of the game
 * @param gameId - The game session ID
 * @param playerId - The player ID submitting the pool
 * @param poolIds - Array of item IDs in the pool
 * @param secretWordId - The secret word ID
 */
export const handleSubmitPool = async (
  gameName: string,
  gameId: UID,
  playerId: UID,
  poolIds: UID[],
  secretWordId: UID,
) => {
  return await utils.firestore.updateState({
    gameName,
    gameId,
    playerId,
    actionText: 'submit the pool',
    change: { poolIds, secretWordId },
  });
};

/**
 * Submits the metrics for the items
 * @param gameName - The name of the game
 * @param gameId - The game session ID
 * @param playerId - The player ID submitting metrics
 * @param metrics - Dictionary mapping item IDs to metric values
 */
export const handleSubmitMetrics = async (
  gameName: string,
  gameId: UID,
  playerId: UID,
  metrics: Record<string, number>,
) => {
  return await utils.firestore.updateState({
    gameName,
    gameId,
    playerId,
    actionText: 'submit the metrics',
    change: { metrics },
    nextPhaseFunction: getNextPhase,
  });
};

/**
 * Submits the player's guesses for item positions
 * @param gameName - The name of the game
 * @param gameId - The game session ID
 * @param playerId - The player ID submitting guesses
 * @param guesses - Array of guess objects
 */
export const handleSubmitGuess = async (gameName: string, gameId: UID, playerId: UID, guesses: Guess[]) => {
  return await utils.firestore.updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit your guess',
    change: { guesses },
    shouldReady: guesses.length > 1, // If more than one guess, player is ready
    nextPhaseFunction: getNextPhase,
  });
};
