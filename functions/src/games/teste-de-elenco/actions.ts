// Services
import { updatePlayer } from '../../services/game-session';
// Internal
import { getNextPhase } from './index';

/**
 * Submits the player's selected genre, movie title, and props
 * @param gameName - The name of the game
 * @param gameId - The game session ID
 * @param playerId - The player ID submitting the genre
 * @param genre - The selected genre
 * @param movieTitle - The movie title
 * @param propsIds - Array of selected prop IDs
 */
export const handleSubmitGenre = async (
  gameName: string,
  gameId: UID,
  playerId: UID,
  genre: string,
  movieTitle: string,
  propsIds: UID[],
) => {
  return await updatePlayer({
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

/**
 * Submits the player's actor selection for the scene
 * @param gameName - The name of the game
 * @param gameId - The game session ID
 * @param playerId - The player ID submitting the actor
 * @param actorId - The selected actor ID
 */
export const handleSubmitActor = async (gameName: string, gameId: UID, playerId: UID, actorId: UID) => {
  return await updatePlayer({
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
