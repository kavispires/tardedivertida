// Helpers
import utils from '../../utils';
// Internal functions
import { getNextPhase } from './index';

/**
 * Submits a word created from character names
 * @param gameName - The name of the game
 * @param gameId - The game session ID
 * @param playerId - The player ID submitting the word
 * @param names - Array of character names used
 * @param indexes - Array of character indexes used
 * @param newWord - The created word
 */
export const handleSubmitWord = async (
  gameName: string,
  gameId: UID,
  playerId: UID,
  names: string[],
  indexes: number[],
  newWord: string,
) => {
  return await utils.firestore.updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit word',
    shouldReady: true,
    change: {
      names,
      newWord,
      namesIndexes: indexes,
    },
    nextPhaseFunction: getNextPhase,
    shouldGoToNextPhase: true,
  });
};

/**
 * Submits guesses matching words to players
 * @param gameName - The name of the game
 * @param gameId - The game session ID
 * @param playerId - The player ID submitting guesses
 * @param guesses - Array of player IDs in guess order
 */
export const handleSubmitGuess = async (gameName: string, gameId: UID, playerId: UID, guesses: UID[]) => {
  return await utils.firestore.updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit guesses',
    shouldReady: true,
    change: {
      guesses,
    },
    nextPhaseFunction: getNextPhase,
  });
};
