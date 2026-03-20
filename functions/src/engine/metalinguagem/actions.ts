// Helpers
import utils from '../../utils';
// Internal functions
import { getNextPhase } from './index';

/**
 * Submits word
 * @param gameName
 * @param gameId
 * @param playerId
 * @param names
 * @param newWord
 * @returns
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
 * Submits guesses
 * @param gameName
 * @param gameId
 * @param playerId
 * @param cardId
 * @returns
 */
export const handleSubmitGuess = async (
  gameName: string,
  gameId: UID,
  playerId: UID,
  guesses: UID[],
) => {
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
