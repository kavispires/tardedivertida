// Helpers
import { updatePlayer } from '../../services/game-session';
// Internal functions
import { getNextPhase } from './index';

/**
 * Submits the player's selected prompt
 * @param gameName - The name of the game
 * @param gameId - The game session ID
 * @param playerId - The player ID submitting the prompt
 * @param promptId - The selected prompt ID
 * @param [randomSelection] - Whether the selection was random
 */
export const handleSubmitPrompt = async (
  gameName: string,
  gameId: UID,
  playerId: UID,
  promptId: string,
  randomSelection = false,
) => {
  return await updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit prompt',
    shouldReady: true,
    change: { promptId, randomSelection },
    nextPhaseFunction: getNextPhase,
  });
};

/**
 * Submits the player's drawing
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
    actionText: 'submit drawing',
    shouldReady: true,
    change: { drawing },
    nextPhaseFunction: getNextPhase,
  });
};

/**
 * Submits the player's guess for a drawing
 * @param gameName - The name of the game
 * @param gameId - The game session ID
 * @param playerId - The player ID submitting the guess
 * @param guess - The guess string
 */
export const handleSubmitGuess = async (gameName: string, gameId: UID, playerId: UID, guess: string) => {
  return await updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit guess',
    shouldReady: true,
    change: { guess },
    nextPhaseFunction: getNextPhase,
  });
};
