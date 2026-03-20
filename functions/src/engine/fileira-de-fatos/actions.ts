// Helpers
import utils from '../../utils';
// Internal functions
import { getNextPhase } from './index';

export const handleSubmitScenarioOrder = async (
  gameName: string,
  gameId: UID,
  playerId: UID,
  order: UID[],
) => {
  return await utils.firestore.updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit the scenario order',
    shouldReady: true,
    change: { currentOrder: order },
    nextPhaseFunction: getNextPhase,
  });
};
