// Types
import type { ControleDeEstoqueState, ControleDeEstoqueStore, Good, WarehouseSlot } from './types';
// Constants
import { CONTROLE_DE_ESTOQUE_PHASES, WAREHOUSE_SIZE } from './constants';
import { LETTERS } from '../../utils/constants';
// Utils
import utils from '../../utils';

/**
 * Determine the next phase based on the current one
 * @param currentPhase
 * @param round
 * @returns
 */
export const determineNextPhase = (
  currentPhase: string,
  round: Round,
  state: ControleDeEstoqueState,
): string => {
  const { RULES, SETUP, GOOD_PLACEMENT, PLACEMENT_CONFIRMATION, FULFILLMENT, RESULTS, GAME_OVER } =
    CONTROLE_DE_ESTOQUE_PHASES;
  const order = [RULES, SETUP, GOOD_PLACEMENT, PLACEMENT_CONFIRMATION, FULFILLMENT, RESULTS, GAME_OVER];

  // If last round and
  if (currentPhase === PLACEMENT_CONFIRMATION) {
    if (round.current === round.total && state.roundsGoodIndex === state.roundGoods.length - 1) {
      return FULFILLMENT;
    }

    return GOOD_PLACEMENT;
  }

  if (currentPhase === RESULTS) {
    return round.forceLastRound || (round.current > 0 && round.current === round.total)
      ? GAME_OVER
      : FULFILLMENT;
  }

  const currentPhaseIndex = order.indexOf(currentPhase);

  if (currentPhaseIndex > -1) {
    return order[currentPhaseIndex + 1];
  }
  console.warn('Missing phase check');
  return FULFILLMENT;
};

/**
 * Updates the availability status of slots in a warehouse grid.
 *
 * This function iterates through each slot in the provided warehouse grid and
 * sets the `available` property to `true` if the slot has no amenity, no good,
 * and is adjacent to a slot that contains a good. Otherwise, it sets the
 * `available` property to `false`.
 *
 * @param warehouseGrid - An array representing the warehouse grid, where each
 * slot is an object containing properties such as `amenityId`, `goodId`, and
 * `available`.
 */
export const updateAvailableSlotsInWarehouse = (warehouseGrid: Collection<WarehouseSlot>) => {
  // The warehouse grid is a 7x7 grid, if an empty slot is adjacent
  const totalSlots = WAREHOUSE_SIZE * WAREHOUSE_SIZE; // 49 slots in total

  // Helper function to check if a neighboring slot contains a goodId
  const hasAdjacentGood = (index: number): boolean => {
    const row = Math.floor(index / WAREHOUSE_SIZE);
    const col = index % WAREHOUSE_SIZE;

    // Array of row/col deltas to check orthogonal neighbors (up, down, left, right)
    const directions = [
      [-1, 0], // above
      [1, 0], // below
      [0, -1], // left
      [0, 1], // right
    ];

    for (const [dx, dy] of directions) {
      const newRow = row + dx;
      const newCol = col + dy;

      // Check if the new row and column are within bounds of the grid
      if (newRow >= 0 && newRow < WAREHOUSE_SIZE && newCol >= 0 && newCol < WAREHOUSE_SIZE) {
        const neighborIndex = newRow * WAREHOUSE_SIZE + newCol;
        if (warehouseGrid[neighborIndex].goodId) {
          return true;
        }
      }
    }
    return false;
  };

  let availableCount = 0;
  // Loop through each slot in the grid
  for (let i = 0; i < totalSlots; i++) {
    const slot = warehouseGrid[i];

    // If slot has no amenity, no good, and has an adjacent slot with a good
    if (!slot.amenityId && !slot.goodId && hasAdjacentGood(i)) {
      slot.available = true;
      slot.temporaryName = LETTERS[availableCount];
      availableCount++;
    } else {
      slot.available = false;
      slot.temporaryName = null;
    }
  }
};

/**
 * A function that makes only edge slots available based on the absence of an amenity and good.
 * @param warehouseGrid - A 1D array of WarehouseSlot objects representing a 7x7 grid.
 */
export const updateEdgeAvailability = (warehouseGrid: Collection<WarehouseSlot>) => {
  const totalSlots = WAREHOUSE_SIZE * WAREHOUSE_SIZE; // 49 slots in total

  let availableCount = 0;
  // Loop through each slot in the grid
  for (let i = 0; i < totalSlots; i++) {
    const slot = warehouseGrid[i];

    // Determine if the slot is on an edge (top, bottom, left, or right)
    const isTopEdge = i >= 0 && i < WAREHOUSE_SIZE; // Top row
    const isBottomEdge = i >= totalSlots - WAREHOUSE_SIZE && i < totalSlots; // Bottom row
    const isLeftEdge = i % WAREHOUSE_SIZE === 0; // Left column
    const isRightEdge = i % WAREHOUSE_SIZE === WAREHOUSE_SIZE - 1; // Right column

    const isEdge = isTopEdge || isBottomEdge || isLeftEdge || isRightEdge;

    // If it's an edge and does not have amenityId or goodId, mark it as available
    if (isEdge && !slot.amenityId && !slot.goodId) {
      slot.available = true;
      slot.temporaryName = LETTERS[availableCount];
      availableCount++;
    } else {
      slot.available = false;
      slot.temporaryName = null;
    }
  }
};

export const concealAllGoods = (goodsDict: Collection<Good>) => {
  Object.values(goodsDict).forEach((good) => {
    good.exposed = false;
  });
};

export const buildRanking = (
  players: Players,
  goodsDict: Collection<Good>,
  warehouseGrid: Collection<WarehouseSlot>,
  store: ControleDeEstoqueStore,
) => {
  // Gained Points: [correct order, wrong order, out of stock]
  const scores = new utils.players.Scores(players, [0, 0, 0]);

  // Dictionary of players and the corrected filled orders: PlayerId: OrderId[]
  const gallery: Collection<string[]> = {};

  // For each player, check their orders and fulfillments
  utils.players.getListOfPlayers(players).forEach((player) => {
    let correctAtOnce = 0;
    player.orders.forEach((orderId: string) => {
      const isFulfilled = player.fulfillment[orderId] !== undefined;

      if (isFulfilled) {
        // Achievement: tried to fulfill
        utils.achievements.increase(store, player.id, 'attempts', 1);

        // Fulfilled an order correctly, grant 3 points
        if (goodsDict[orderId].slot === player.fulfillment[orderId]) {
          scores.add(player.id, 3, 0);
          correctAtOnce++;
          // Update gallery
          gallery[player.id] = [...(gallery[player.id] || []), orderId];
          // Update warehouse grid
          if (typeof goodsDict[orderId].slot === 'number') {
            const slot = goodsDict[orderId].slot as number;
            warehouseGrid[slot].orderId = orderId;
            warehouseGrid[slot].status = 'correct';
            warehouseGrid[slot].fulfillerId = player.id;
          }
        } else {
          // Incorrectly fulfilled orders grant -1 point
          scores.add(player.id, -1, 1);
          if (goodsDict[orderId].slot === null) {
            // Achievement: tried to fulfill an out of stock order
            utils.achievements.increase(store, player.id, 'outOfStockFulfillment', 1);
          }
        }
      } else {
        // Achievement: skipped an order
        utils.achievements.increase(store, player.id, 'skips', 1);

        // If not fulfilled and out of stock, grant 3 points
        if (goodsDict[orderId].slot === null) {
          scores.add(player.id, 3, 2);

          // Achievement: skipped an out of stock order
          utils.achievements.increase(store, player.id, 'outOfStock', 1);
        }
      }

      // Achievement: fulfilled  at once
      utils.achievements.increase(store, player.id, 'correctAtOnce', correctAtOnce);
    });
  });

  return {
    ranking: scores.rank(players),
    gallery,
  };
};
