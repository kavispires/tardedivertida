// Utils
import { updatePlayer, updateStore } from '../../services/game-session';
// Internal
import { getNextPhase } from '.';

/**
 * Submits each player's movie choice for the round
 * @param gameName - The name of the game
 * @param gameId - The game session ID
 * @param playerId - The player ID selecting a movie
 * @param movieId - The selected movie ID
 */
export const handleSelectMovie = async (gameName: string, gameId: UID, playerId: UID, movieId: UID) => {
  return await updatePlayer({
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
 * Attempts to eliminate one of the movies from the pool
 * @param gameName - The name of the game
 * @param gameId - The game session ID
 * @param playerId - The player ID eliminating the movie
 * @param movieId - The movie ID to eliminate
 */
export const handleEliminateMovie = async (gameName: string, gameId: UID, playerId: UID, movieId: UID) => {
  return await updateStore({
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
 * Submits a player's vote for their favorite movie poster
 * @param gameName - The name of the game
 * @param gameId - The game session ID
 * @param playerId - The player ID voting for a poster
 * @param movieId - The movie ID associated with the poster
 * @param posterId - The poster ID being voted for
 */
export const handleVoteForPoster = async (
  gameName: string,
  gameId: UID,
  playerId: UID,
  movieId: UID,
  posterId: UID,
) => {
  return await updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit movie poster',
    shouldReady: true,
    change: { [`posters.${movieId}`]: posterId },
  });
};
