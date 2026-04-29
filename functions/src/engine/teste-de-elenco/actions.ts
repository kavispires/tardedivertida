// Helpers
import utils from '../../utils';
// Internal functions
import { getNextPhase } from './index';

export const handleSubmitGenre = async (
  gameName: string,
  gameId: UID,
  playerId: UID,
  genre: string,
  movieTitle: string,
  propsIds: UID[],
) => {
  return await utils.firestore.updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit the genre',
    shouldReady: true,
    change: {
      genre,
      selectedProps: propsIds,
      movieTitle,
    },
    nextPhaseFunction: getNextPhase,
  });
};

export const handleSubmitActor = async (gameName: string, gameId: UID, playerId: UID, actorId: UID) => {
  return await utils.firestore.updatePlayer({
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
