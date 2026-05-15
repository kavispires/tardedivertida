// Helpers
import utils from '../../utils';
// Internal functions
import { getNextPhase } from './index';

/**
 * Submits paired selections
 * @param gameName - The name of the game
 * @param gameId - The game session ID
 * @param playerId - The player ID submitting pairs
 * @param pairs - Array of paired item IDs
 */
export const handleSubmitPairs = async (gameName: string, gameId: UID, playerId: UID, pairs: UID[]) => {
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
