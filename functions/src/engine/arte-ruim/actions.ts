// Helpers
import { updatePlayer } from '../../services/game-session';
// Internal functions
import { getNextPhase } from './index';

/**
 * Handles player drawing submission
 * @param gameName - The name of the game
 * @param gameId - The game session ID
 * @param playerId - The player ID submitting the drawing
 * @param drawing - The drawing data
 */
export const handleSubmitDrawing = async (gameName: string, gameId: UID, playerId: UID, drawing: string) => {
  return await updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit your drawing',
    shouldReady: true,
    change: { 'currentCard.drawing': drawing },
    nextPhaseFunction: getNextPhase,
  });
};

/**
 * Handles player voting submission for which drawing matches which card
 * @param gameName - The name of the game
 * @param gameId - The game session ID
 * @param playerId - The player ID submitting votes
 * @param votes - Dictionary of votes mapping drawings to cards
 * @param choseRandomly - Whether the player chose randomly
 */
export const handleSubmitVoting = async (
  gameName: string,
  gameId: UID,
  playerId: UID,
  votes: Dictionary<string>,
  choseRandomly: boolean,
) => {
  return await updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit your votes',
    shouldReady: true,
    change: { votes, choseRandomly: Boolean(choseRandomly) },
    nextPhaseFunction: getNextPhase,
  });
};
