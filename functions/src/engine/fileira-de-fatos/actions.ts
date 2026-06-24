// Helpers
import { updatePlayer } from '../../services/game-session';
// Internal functions
import { getNextPhase } from './index';

/**
 * Handles submission of scenario ordering
 * @param gameName - The name of the game
 * @param gameId - The game session ID
 * @param playerId - The player ID submitting the order
 * @param order - Array of scenario IDs in the submitted order
 */
export const handleSubmitScenarioOrder = async (
  gameName: string,
  gameId: UID,
  playerId: UID,
  order: UID[],
) => {
  return await updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit the scenario order',
    shouldReady: true,
    change: { currentOrder: order },
    nextPhaseFunction: getNextPhase,
  });
};
