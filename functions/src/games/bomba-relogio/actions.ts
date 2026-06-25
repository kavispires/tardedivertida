// Types
import type { Declaration, Target } from './types';
// Services
import { updatePlayer, updateState } from '../../services/game-session';
// Internal
import { getNextPhase } from './index';

/**
 * Handles player declaration submissions for their role
 * @param gameName - The name of the game
 * @param gameId - The game session ID
 * @param playerId - The player ID submitting declarations
 * @param declarations - The declarations submitted by the player
 */
export const handleSubmitDeclarations = async (
  gameName: string,
  gameId: UID,
  playerId: UID,
  declarations: Declaration,
) => {
  return await updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit the declarations',
    shouldReady: true,
    change: { declarations },
    nextPhaseFunction: getNextPhase,
  });
};

/**
 * Updates the current target player in the game state
 * @param gameName - The name of the game
 * @param gameId - The game session ID
 * @param playerId - The player ID making the update
 * @param targetPlayerId - The ID of the new target player
 */
export const handleUpdateTargetPlayer = async (
  gameName: string,
  gameId: UID,
  playerId: UID,
  targetPlayerId: UID,
) => {
  return await updateState({
    gameName,
    gameId,
    playerId,
    actionText: 'update target player',
    change: {
      currentTargetPlayerId: targetPlayerId,
    },
  });
};

/**
 * Handles target submission for cutting a wire
 * @param gameName - The name of the game
 * @param gameId - The game session ID
 * @param playerId - The player ID submitting the target
 * @param target - The target object containing card and player information
 */
export const handleSubmitTarget = async (gameName: string, gameId: UID, playerId: UID, target: Target) => {
  return await updateState({
    gameName,
    gameId,
    playerId,
    actionText: 'submit your target',
    change: {
      [`status.cut.${target.targetCardIndex}`]: target.targetCard,
      [`status.activePlayerIds.${target.playerIndex}`]: target.playerId,
    },
    nextPhaseFunction: getNextPhase,
  });
};
