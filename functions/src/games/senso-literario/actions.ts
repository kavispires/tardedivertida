// Services
import { updatePlayer } from '../../services/game-session';
// Internal
import { getNextPhase } from './index';

/**
 * Submits the player's selected pattern for the round
 * @param gameName - The name of the game
 * @param gameId - The game session ID
 * @param playerId - The player ID submitting the pattern
 * @param patternId - The selected pattern ID
 */
export const handleSubmitPattern = async (gameName: string, gameId: UID, playerId: UID, patternId: UID) => {
  return await updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit the pattern',
    shouldReady: true,
    change: { patternId },
    nextPhaseFunction: getNextPhase,
  });
};
