// Helpers
import utils from '../../utils';
// Internal functions
import { getNextPhase } from './index';

export const handleSubmitSeeds = async (
  gameName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  data: PlainObject,
) => {
  return await utils.firestore.updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit seeds',
    shouldReady: true,
    change: { data },
    nextPhaseFunction: getNextPhase,
  });
};

export const handleSubmitTrackAnswer = async (
  gameName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  data: PlainObject,
) => {
  return await utils.firestore.updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit track answer',
    shouldReady: true,
    change: { data },
    nextPhaseFunction: getNextPhase,
  });
};
