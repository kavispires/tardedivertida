// Types
import type { ExtendedTextCard } from './types';
// Helpers
import utils from '../../utils';
// Internal functions
import { getNextPhase } from './index';

/**
 * Submits the player's map configuration
 * @param gameName - The name of the game
 * @param gameId - The game session ID
 * @param playerId - The player ID submitting the map
 * @param newMap - Array of text cards representing the map
 * @param [mulligan] - Whether the player wants to redraw the map
 */
export const handleSubmitMap = async (
  gameName: string,
  gameId: UID,
  playerId: UID,
  newMap: (ExtendedTextCard | null)[],
  mulligan = false,
) => {
  return await utils.firestore.updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit your map',
    shouldReady: true,
    change: { newMap, wantsToMulligan: mulligan },
    nextPhaseFunction: getNextPhase,
  });
};

/**
 * Submits the player's path guess for a specific path
 * @param gameName - The name of the game
 * @param gameId - The game session ID
 * @param playerId - The player ID submitting the path
 * @param pathId - The path ID being guessed
 * @param guess - Array of card IDs representing the path
 * @param [choseRandomly] - Whether the guess was chosen randomly
 */
export const handleSubmitPath = async (
  gameName: string,
  gameId: UID,
  playerId: UID,
  pathId: UID,
  guess: UID[],
  choseRandomly?: boolean,
) => {
  return await utils.firestore.updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit your guess',
    shouldReady: true,
    change: { [`guesses.${pathId}`]: guess, choseRandomly: Boolean(choseRandomly) },
    nextPhaseFunction: getNextPhase,
  });
};
