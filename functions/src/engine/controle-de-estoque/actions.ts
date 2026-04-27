// Helpers
import utils from '../../utils';
// Internal functions
import { getNextPhase } from './index';

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
