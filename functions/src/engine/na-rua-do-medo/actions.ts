// Types
import type { Decisions } from './types';
// Helpers
import { updatePlayer } from '../../services/game-session';
// Internal functions
import { getNextPhase } from './index';

/**
 * Submits the player's decision during a challenge
 * @param gameName - The name of the game
 * @param gameId - The game session ID
 * @param playerId - The player ID making the decision
 * @param decision - The decision object
 */
export const handleSubmitDecision = async (
  gameName: string,
  gameId: UID,
  playerId: UID,
  decision: Decisions,
) => {
  return await updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit your decision',
    shouldReady: true,
    change: { decision },
    nextPhaseFunction: getNextPhase,
  });
};
