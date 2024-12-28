// Utils
import utils from '../../utils';
// Internal
import { getNextPhase } from '.';

/**
 * When each player submit their round's movie choice
 * @param gameName
 * @param gameId
 * @param playerId
 * @param guess
 * @returns
 */
export const handleSelectMovie = async (
  gameName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  movieId: CardId,
) => {
  return await utils.firestore.updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit movie selection',
    shouldReady: true,
    change: { movieId },
    nextPhaseFunction: getNextPhase,
  });
};

/**
 * When a player tries to eliminate one of the movies
 * @param gameName
 * @param gameId
 * @param playerId
 * @param clue
 * @returns
 */
export const handleEliminateMovie = async (
  gameName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  movieId: CardId,
) => {
  return await utils.firestore.updateStore({
    gameName,
    gameId,
    playerId,
    actionText: 'eliminate movie',
    change: {
      currentMovieId: movieId,
    },
    nextPhaseFunction: getNextPhase,
  });
};

/**
 * During reveal players may vote for the poster
 * @param gameName
 * @param gameId
 * @param playerId
 * @param clue
 * @returns
 */
export const handleVoteForPoster = async (
  gameName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  movieId: CardId,
  posterId: CardId,
) => {
  return await utils.firestore.updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit movie poster',
    shouldReady: true,
    change: { [`posters.${movieId}`]: posterId },
  });
};
