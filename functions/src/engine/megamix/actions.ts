// Helpers
import utils from '../../utils';
// Internal functions
import { getNextPhase } from './index';

export const handleSubmitSeeds = async (
  gameName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  data: PlainObject
) => {
  return await utils.firebase.updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit seeds',
    shouldReady: true,
    change: { data },
    nextPhaseFunction: getNextPhase,
  });
};

export const handleSubmitTask = async (
  gameName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  data: PlainObject
) => {
  return await utils.firebase.updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit task',
    shouldReady: true,
    change: { data },
    nextPhaseFunction: getNextPhase,
  });
};
