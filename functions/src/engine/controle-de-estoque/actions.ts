// Helpers
import utils from '../../utils';
// Internal functions
import { getNextPhase } from './index';
// import { FirebaseStateData } from './types';

export const handlePlaceGood = async (
  gameName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  goodId: string,
  newWarehouseSlot: number,
  previousWarehouseSlot?: number | null,
  concealed?: boolean
) => {
  const goodsUpdate = {
    [`goodsDict.${goodId}.slot`]: newWarehouseSlot,
    [`goodsDict.${goodId}.exposed`]: concealed ?? true,
  };

  const warehouseUpdate: Record<string, unknown> = {
    [`warehouseGrid.${newWarehouseSlot}.goodId`]: goodId,
    [`warehouseGrid.${newWarehouseSlot}.available`]: false,
  };
  if (previousWarehouseSlot !== undefined && previousWarehouseSlot !== null) {
    warehouseUpdate[`warehouseGrid.${previousWarehouseSlot}.goodId`] = null;
    warehouseUpdate[`warehouseGrid.${previousWarehouseSlot}.available`] = true;
  }

  return await utils.firestore.updateState({
    gameName,
    gameId,
    playerId,
    actionText: 'place good',
    change: {
      ...goodsUpdate,
      ...warehouseUpdate,
    },
    nextPhaseFunction: previousWarehouseSlot === null ? getNextPhase : undefined,
  });
};

export const handleFulfillOrders = async (
  gameName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  fulfillments: Record<string, number> // goodId: slotId
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
