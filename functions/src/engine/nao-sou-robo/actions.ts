// Helpers
import utils from '../../utils';
// Internal functions
import { getNextPhase } from './index';

/**
 * Submits card
 * @param gameName
 * @param gameId
 * @param playerId
 * @param cardIds
 * @returns
 */
export const handleSubmitCards = async (gameName: string, gameId: UID, playerId: UID, cardIds: UID[]) => {
  return await utils.firestore.updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit card',
    shouldReady: true,
    change: {
      cardIds,
    },
    nextPhaseFunction: getNextPhase,
  });
};

/**
 * Submits card guess
 * @param gameName
 * @param gameId
 * @param playerId
 * @param guess
 * @returns
 */
export const handleSubmitCardGuess = async (gameName: string, gameId: UID, playerId: UID, guess: UID[]) => {
  return await utils.firestore.updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit non-robot cards',
    shouldReady: true,
    change: {
      guess,
    },
    nextPhaseFunction: getNextPhase,
  });
};
