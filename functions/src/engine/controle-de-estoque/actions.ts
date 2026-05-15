// Helpers
import utils from '../../utils';
// Internal functions
import { getNextPhase } from './index';

/**
 * Handles placing a good in a warehouse slot (preview)
 * @param gameName - The name of the game
 * @param gameId - The game session ID
 * @param playerId - The player ID placing the good
 * @param selectedWarehouseSlot - The selected warehouse slot number
 */
export const handlePlaceGood = async (
  gameName: string,
  gameId: UID,
  playerId: UID,
  selectedWarehouseSlot: number,
) => {
  return await utils.firestore.updateState({
    gameName,
    gameId,
    playerId,
    actionText: 'place good',
    change: {
      selectedWarehouseSlot,
    },
  });
};

/**
 * Handles confirming the placement of a good in a warehouse slot
 * @param gameName - The name of the game
 * @param gameId - The game session ID
 * @param playerId - The player ID confirming the placement
 * @param selectedWarehouseSlot - The selected warehouse slot number
 */
export const handleConfirmGood = async (
  gameName: string,
  gameId: UID,
  playerId: UID,
  selectedWarehouseSlot: number,
) => {
  return await utils.firestore.updateState({
    gameName,
    gameId,
    playerId,
    actionText: 'place good',
    change: {
      selectedWarehouseSlot,
    },
    nextPhaseFunction: getNextPhase,
  });
};

/**
 * Handles order fulfillment submissions
 * @param gameName - The name of the game
 * @param gameId - The game session ID
 * @param playerId - The player ID fulfilling orders
 * @param fulfillments - Dictionary mapping good IDs to slot IDs
 */
export const handleFulfillOrders = async (
  gameName: string,
  gameId: UID,
  playerId: UID,
  fulfillments: Record<string, number>, // goodId: slotId
) => {
  return await utils.firestore.updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit fulfillments',
    shouldReady: true,
    change: { fulfillments },
    nextPhaseFunction: getNextPhase,
  });
};
