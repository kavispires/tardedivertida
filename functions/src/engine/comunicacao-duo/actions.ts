// Helpers
import { updatePlayer } from '../../services/game-session';
// Internal functions
import { getNextPhase } from './index';

/**
 * Handles request submission with clue and quantity
 * @param gameName - The name of the game
 * @param gameId - The game session ID
 * @param playerId - The player ID submitting the request
 * @param clue - The clue string
 * @param clueQuantity - The number of items the clue refers to
 */
export const handleSubmitRequest = async (
  gameName: string,
  gameId: UID,
  playerId: UID,
  clue: string,
  clueQuantity: number,
) => {
  return await updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit your clue',
    shouldReady: true,
    shouldGoToNextPhase: true,
    change: { clue, clueQuantity },
    nextPhaseFunction: getNextPhase,
  });
};

/**
 * Handles delivery submission by the responding player
 * @param gameName - The name of the game
 * @param gameId - The game session ID
 * @param playerId - The player ID submitting the delivery
 * @param delivery - The delivery string
 */
export const handleSubmitDelivery = async (
  gameName: string,
  gameId: UID,
  playerId: UID,
  delivery: string,
) => {
  return await updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit your delivery',
    shouldReady: true,
    shouldGoToNextPhase: true,
    change: { delivery },
    nextPhaseFunction: getNextPhase,
  });
};

/**
 * Handles player stopping their delivery
 * @param gameName - The name of the game
 * @param gameId - The game session ID
 * @param playerId - The player ID stopping delivery
 */
export const handleStopDelivering = async (gameName: string, gameId: UID, playerId: UID) => {
  return await updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'stop delivering',
    shouldReady: true,
    shouldGoToNextPhase: true,
    change: { stopDelivery: true },
    nextPhaseFunction: getNextPhase,
  });
};
