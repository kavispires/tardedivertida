// Helpers
import { updatePlayer, updateState } from '../../services/game-session';
// Internal functions
import { getNextPhase } from './index';

/**
 * Submits the player's target selection
 * @param gameName - The name of the game
 * @param gameId - The game session ID
 * @param playerId - The player ID submitting the target
 * @param targetId - The target player ID
 */
export const handleSubmitTarget = async (gameName: string, gameId: UID, playerId: UID, targetId: UID) => {
  return await updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit your target',
    shouldReady: true,
    change: { target: targetId },
  });
};

/**
 * Submits a message with a target to other players
 * @param gameName - The name of the game
 * @param gameId - The game session ID
 * @param playerId - The player ID sending the message
 * @param targetId - The target ID in the message
 * @param [recipientId] - The recipient player ID (optional, defaults to ALL)
 */
export const handleSubmitMessage = async (
  gameName: string,
  gameId: UID,
  playerId: UID,
  targetId: UID,
  recipientId?: UID,
) => {
  // Handle player
  await updateState({
    gameName,
    gameId,
    playerId,
    actionText: 'used message',
    change: { messaged: true },
    nextPhaseFunction: getNextPhase,
  });

  // Handle state
  return await updateState({
    gameName,
    gameId,
    playerId,
    actionText: 'submit message',

    change: { [`messages.${playerId}`]: { targetId, recipientId: recipientId || 'ALL' } },
    nextPhaseFunction: getNextPhase,
  });
};

/**
 * Submits the player's decision about their target
 * @param gameName - The name of the game
 * @param gameId - The game session ID
 * @param playerId - The player ID making the decision
 * @param decision - The decision string
 */
export const handleSubmitDecision = async (
  gameName: string,
  gameId: UID,
  playerId: UID,
  decision: string,
) => {
  return await updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit decision',
    shouldReady: true,
    change: { decision },
    nextPhaseFunction: getNextPhase,
  });
};
