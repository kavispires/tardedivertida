// Helpers
import { updatePlayer } from '../../services/game-session';
// Internal functions
import { getNextPhase } from './index';

/**
 * Submits the player's drawing for the alert sign
 * @param gameName - The name of the game
 * @param gameId - The game session ID
 * @param playerId - The player ID submitting the drawing
 * @param drawing - The drawing data string
 */
export const handleSubmitDrawing = async (gameName: string, gameId: UID, playerId: UID, drawing: string) => {
  return await updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit your drawing',
    shouldReady: true,
    change: { currentDrawing: drawing },
    nextPhaseFunction: getNextPhase,
  });
};

/**
 * Submits the player's evaluation guesses matching drawings to categories
 * @param gameName - The name of the game
 * @param gameId - The game session ID
 * @param playerId - The player ID submitting evaluations
 * @param guesses - Dictionary mapping category IDs to arrays of drawing IDs
 * @param choseRandomly - Whether guesses were chosen randomly
 */
export const handleSubmitEvaluation = async (
  gameName: string,
  gameId: UID,
  playerId: UID,
  guesses: Dictionary<UID[]>,
  choseRandomly: boolean,
) => {
  return await updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit your evaluation',
    shouldReady: true,
    change: { guesses, choseRandomly: Boolean(choseRandomly) },
    nextPhaseFunction: getNextPhase,
  });
};
