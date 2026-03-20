// Helpers
import utils from '../../utils';
// Internal functions
import { getNextPhase } from './index';

/**
 * Submits the pairs
 * @param gameName
 * @param gameId
 * @param playerId
 * @param pairs
 * @returns
 */
export const handleSubmitPairs = async (
  gameName: string,
  gameId: UID,
  playerId: UID,
  pairs: UID[],
) => {
  return await utils.firestore.updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit pairs',
    shouldReady: true,
    change: {
      pairs,
    },
    nextPhaseFunction: getNextPhase,
  });
};
