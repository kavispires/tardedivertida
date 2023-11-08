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
  gameName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  pairs: CardId[]
) => {
  return await utils.firebase.updatePlayer({
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
