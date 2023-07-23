// Helpers
import utils from '../../utils';
// Internal functions
import { getNextPhase } from './index';

export const handleSubmitScenarioOrder = async (
  gameName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  order: CardId[]
) => {
  return await utils.firebase.updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit the scenario order',
    shouldReady: true,
    change: { currentOrder: order },
    nextPhaseFunction: getNextPhase,
  });
};
