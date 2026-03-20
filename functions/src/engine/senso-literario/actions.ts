// Helpers
import utils from '../../utils';
// Internal functions
import { getNextPhase } from './index';

export const handleSubmitPattern = async (
  gameName: string,
  gameId: UID,
  playerId: UID,
  patternId: UID,
) => {
  return await utils.firestore.updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit the pattern',
    shouldReady: true,
    change: { patternId },
    nextPhaseFunction: getNextPhase,
  });
};
