// Helpers
import utils from '../../utils';
// Internal functions
import { getNextPhase } from './index';

export const handleSubmitGenre = async (
  gameName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  genre: string
) => {
  return await utils.firebase.updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit the genre',
    shouldReady: true,
    change: {
      genre,
    },
    nextPhaseFunction: getNextPhase,
  });
};

export const handleSubmitActor = async (
  gameName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  actorId: CardId
) => {
  return await utils.firebase.updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit your actor',
    shouldReady: true,
    change: {
      actorId,
    },
    nextPhaseFunction: getNextPhase,
  });
};
