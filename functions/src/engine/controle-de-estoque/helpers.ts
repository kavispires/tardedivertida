// Types
import type {
  ControleDeEstoqueState,
  ControleDeEstoqueStore,
  Event,
  Gallery,
  Good,
  Status,
  WarehouseSlot,
} from './types';
// Constants
import { CONTROLE_DE_ESTOQUE_PHASES, WAREHOUSE_SIZE } from './constants';
import { LETTERS } from '../../utils/constants';
// Utils
import utils from '../../utils';
import { BOSS_IDEAS } from './data';
import { orderBy, shuffle } from 'lodash';
import { increaseAchievement, pushAchievement } from './achievements';

/**
 * Determines the next phase based on the current phase and game state
 * @param currentPhase - The current phase of the game
 * @param round - The round object containing current round information
 * @param state - The current state of the game
 */
export const determineNextPhase = (
  currentPhase: string,
  round: Round,
  state: ControleDeEstoqueState,
): string => {
  const { SETUP, THE_WAREHOUSE, GOOD_PLACEMENT, PLACEMENT_CONFIRMATION, FULFILLMENT, RESULTS, GAME_OVER } =
    CONTROLE_DE_ESTOQUE_PHASES;
  const order = [
    SETUP,
    THE_WAREHOUSE,
    GOOD_PLACEMENT,
    PLACEMENT_CONFIRMATION,
    FULFILLMENT,
    RESULTS,
    GAME_OVER,
  ];

  // SETUP → THE_WAREHOUSE
  if (currentPhase === SETUP) {
    return THE_WAREHOUSE;
  }

  // THE_WAREHOUSE → GOOD_PLACEMENT (when all players ready)
  if (currentPhase === THE_WAREHOUSE) {
    return GOOD_PLACEMENT;
  }

  // PLACEMENT_CONFIRMATION → check if all goods placed
  if (currentPhase === GOOD_PLACEMENT) {
    // If all goods have been placed (no more available goods), move to FULFILLMENT
    if (!state.availableGoods || state.availableGoods.length === 0) {
      return FULFILLMENT;
    }
    // Otherwise, continue placing goods
    return GOOD_PLACEMENT;
  }

  if (currentPhase === RESULTS) {
    const playerCount = utils.players.getPlayerCount(state.players);

    return round.forceLastRound ||
      (round.current > 0 && round.current === round.total) ||
      state?.ordersLeft < playerCount
      ? GAME_OVER
      : FULFILLMENT;
  }

  return utils.game.nextPhaseDelegator(currentPhase, order);
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
export const updateAvailableSlotsInWarehouse = (
  warehouseGrid: Dictionary<WarehouseSlot>,
  bossIdeaId: string,
  status: Status,
) => {
  switch (bossIdeaId) {
    // AISLE: Single row or column
    case BOSS_IDEAS.AISLE.id: {
      updateWarehouseByAisleAvailability(warehouseGrid, status);
      break;
    }
    // WALLS: Edge only
    case BOSS_IDEAS.WALLS.id: {
      updateWarehouseByEdgeAvailability(warehouseGrid);
      break;
    }
    // FENG_SHUI: Rotates the entire warehouse 90deg
    case BOSS_IDEAS.FENG_SHUI.id: {
      updateWarehouseByRotation(warehouseGrid);
      break;
    }
    // Default: adjacent availability
    default: {
      updateWarehouseByAdjacency(warehouseGrid);
      break;
    }
  }
};

const updateWarehouseByAdjacency = (warehouseGrid: Dictionary<WarehouseSlot>) => {
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

export const updateWarehouseByAisleAvailability = (
  warehouseGrid: Dictionary<WarehouseSlot>,
  status: Status,
) => {
  const totalSlots = WAREHOUSE_SIZE * WAREHOUSE_SIZE; // 49 slots in total

  // Count empty slots for each row and column
  const rowEmptyCounts: number[] = Array(WAREHOUSE_SIZE).fill(0);
  const colEmptyCounts: number[] = Array(WAREHOUSE_SIZE).fill(0);

  // First pass: count empty slots in each row and column
  for (let i = 0; i < totalSlots; i++) {
    const slot = warehouseGrid[i];
    const row = Math.floor(i / WAREHOUSE_SIZE);
    const col = i % WAREHOUSE_SIZE;

    if (!slot.amenityId && !slot.goodId) {
      rowEmptyCounts[row]++;
      colEmptyCounts[col]++;
    }
  }

  let targetRow = -1;
  let targetCol = -1;

  // Try to retrieve previously selected aisle from status.additionalInfo
  // Format: 'row:3' or 'col:5'
  if (status.additionalInfo) {
    const [aisleType, aisleIndex] = status.additionalInfo.split(':');
    const index = Number.parseInt(aisleIndex, 10);

    if (aisleType === 'row' && rowEmptyCounts[index] > 0) {
      // Previous row still has empty slots, keep using it
      targetRow = index;
    } else if (aisleType === 'col' && colEmptyCounts[index] > 0) {
      // Previous column still has empty slots, keep using it
      targetCol = index;
    }
  }

  // If no previous aisle or it's exhausted, calculate new best aisle
  if (targetRow === -1 && targetCol === -1) {
    const maxRowEmpty = Math.max(...rowEmptyCounts);
    const maxColEmpty = Math.max(...colEmptyCounts);

    if (maxRowEmpty >= maxColEmpty) {
      // Use the row with most empty slots
      targetRow = rowEmptyCounts.indexOf(maxRowEmpty);
      status.additionalInfo = `row:${targetRow}`;
    } else {
      // Use the column with most empty slots
      targetCol = colEmptyCounts.indexOf(maxColEmpty);
      status.additionalInfo = `col:${targetCol}`;
    }
  }

  // Mark slots in the target row or column as available
  let availableCount = 0;
  for (let i = 0; i < totalSlots; i++) {
    const slot = warehouseGrid[i];
    const row = Math.floor(i / WAREHOUSE_SIZE);
    const col = i % WAREHOUSE_SIZE;

    const isInTargetRow = targetRow !== -1 && row === targetRow;
    const isInTargetCol = targetCol !== -1 && col === targetCol;

    if ((isInTargetRow || isInTargetCol) && !slot.amenityId && !slot.goodId) {
      slot.available = true;
      slot.temporaryName = LETTERS[availableCount];
      availableCount++;
    } else {
      slot.available = false;
      slot.temporaryName = null;
    }
  }
};

export const updateWarehouseByRotation = (warehouseGrid: Dictionary<WarehouseSlot>) => {
  const totalSlots = WAREHOUSE_SIZE * WAREHOUSE_SIZE; // 49 slots in total
  const newGrid: Dictionary<WarehouseSlot> = {};

  // Rotate the grid 90 degrees counter clockwise, making for example, id 0 become id 42, id 6 become 0, id 48 become 6, etc.
  for (let i = 0; i < totalSlots; i++) {
    const row = Math.floor(i / WAREHOUSE_SIZE);
    const col = i % WAREHOUSE_SIZE;

    // Counter-clockwise rotation: (row, col) → (WAREHOUSE_SIZE - 1 - col, row)
    const newRow = WAREHOUSE_SIZE - 1 - col;
    const newCol = row;
    const newIndex = newRow * WAREHOUSE_SIZE + newCol;

    // Copy slot data to new position and update the id to match the new position
    newGrid[newIndex] = { ...warehouseGrid[i], id: newIndex };
  }

  // Copy rotated grid back to original
  for (let i = 0; i < totalSlots; i++) {
    warehouseGrid[i] = newGrid[i];
  }

  // Apply adjacency-based availability after rotation
  updateWarehouseByAdjacency(warehouseGrid);
};

/**
 * A function that makes only edge slots available based on the absence of an amenity and good.
 * @param warehouseGrid - A 1D array of WarehouseSlot objects representing a 7x7 grid.
 */
export const updateWarehouseByEdgeAvailability = (warehouseGrid: Dictionary<WarehouseSlot>) => {
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

/**
 * Conceals all exposed goods and returns an event recording the action
 * @param goodsDict - The dictionary of all goods
 * @param actorId - The ID of the actor performing the action
 * @param type - The type of event
 */
export const concealAllGoods = (
  goodsDict: Dictionary<Good>,
  actorId: Event['actorId'],
  type: Event['type'],
): Event => {
  const goodsIds: string[] = [];

  Object.values(goodsDict).forEach((good) => {
    if (good.exposed) {
      good.exposed = false;
      goodsIds.push(good.id);
    }
  });

  return {
    actorId,
    goodsIds,
    type,
  };
};

/**
 * Conceals a specific good, places it in a warehouse slot, and returns an event
 * @param goodsDict - The dictionary of all goods
 * @param warehouseGrid - The warehouse grid containing slots
 * @param goodId - The ID of the good to conceal
 * @param selectedWarehouseSlot - The slot index where the good is placed
 * @param actorId - The ID of the actor performing the action
 * @param type - The type of event
 */
export const concealGoodsForEvent = (
  goodsDict: Dictionary<Good>,
  warehouseGrid: Dictionary<WarehouseSlot>,
  goodId: string,
  selectedWarehouseSlot: number,
  actorId: Event['actorId'],
  type: Event['type'],
): Event => {
  // Update goodsDict
  if (goodsDict[goodId]) {
    goodsDict[goodId].exposed = false;
    goodsDict[goodId].slot = selectedWarehouseSlot;
  }

  // Update Warehouse Grid
  if (warehouseGrid[selectedWarehouseSlot]) {
    warehouseGrid[selectedWarehouseSlot].goodId = goodId;
  }

  return {
    actorId,
    goodsIds: [goodId],
    type,
  };
};

/**
 * Builds player rankings and gallery based on order fulfillment
 * @param players - The collection of players in the game
 * @param goodsDict - The dictionary of all goods
 * @param warehouseGrid - The warehouse grid containing slots
 * @param store - The Firebase store data for tracking achievements
 */
export const buildRanking = (
  players: Players,
  goodsDict: Dictionary<Good>,
  warehouseGrid: Dictionary<WarehouseSlot>,
  previousOrdersLeft: number,
  currentRound: number,
  store: ControleDeEstoqueStore,
) => {
  // Gained Points: [correct order, wrong order, out of stock, incorrect out of stock]
  const scores = new utils.players.Scores(players, [0, 0, 0, 0]);
  let newOrdersLeft = previousOrdersLeft;

  // Initialize gallery with proper structure
  const gallery: Gallery = {
    fulfilledOrders: {},
    outOfStockOrders: {},
    wrongFulfillments: {},
    wrongOutOfStockOrders: {},
    skippedOrders: {},
  };

  // For each player, check their orders and fulfillments
  utils.players.getListOfPlayers(players).forEach((player) => {
    let correctAtOnce = 0;

    // Initialize arrays for this player
    gallery.fulfilledOrders[player.id] = [];
    gallery.outOfStockOrders[player.id] = [];
    gallery.wrongFulfillments[player.id] = [];
    gallery.wrongOutOfStockOrders[player.id] = [];
    gallery.skippedOrders[player.id] = [];

    player.orders.forEach((orderId: string) => {
      const guessedSlot = player.fulfillments[orderId] ?? null;
      const isFulfilledAttempt = guessedSlot !== null && guessedSlot !== -1;
      const actualSlot = goodsDict[orderId]?.slot ?? null;

      // Player attempted to fulfill the order
      if (isFulfilledAttempt) {
        // Achievement: tried to fulfill
        increaseAchievement(store.achievements, player.id, 'attempts', 1);
        const roundKey = `attemptsRound${currentRound}` as
          | 'attemptsRound1'
          | 'attemptsRound2'
          | 'attemptsRound3';
        increaseAchievement(store.achievements, player.id, roundKey, 1);

        // Fulfilled an order correctly, grant 3 points
        if (actualSlot === guessedSlot) {
          scores.add(player.id, 3, 0);
          correctAtOnce++;

          // Add to fulfilledOrders gallery
          gallery.fulfilledOrders[player.id].push({
            playerId: player.id,
            orderId,
            result: 'correct',
            guessedSlot,
          });

          // Update warehouse grid
          if (typeof actualSlot === 'number' && warehouseGrid[actualSlot]) {
            warehouseGrid[actualSlot].orderId = orderId;
            warehouseGrid[actualSlot].status = 'correct';
            warehouseGrid[actualSlot].fulfillerId = player.id;
            goodsDict[orderId].fulfilledId = player.id;
            newOrdersLeft--;
          }
        } else {
          // Incorrectly fulfilled orders grant -1 point
          scores.add(player.id, -1, 1);

          // Add to wrongFulfillments gallery
          gallery.wrongFulfillments[player.id].push({
            playerId: player.id,
            orderId,
            result: 'wrong-slot',
            guessedSlot,
          });

          if (actualSlot === null) {
            // Achievement: tried to fulfill an out of stock order
            increaseAchievement(store.achievements, player.id, 'outOfStockAttempts', 1);
          }

          player.previousOrders.push(orderId);
        }
        return;
      }

      // Player attempted to mark order as out of stock (guessedSlot === -1)
      if (guessedSlot === -1) {
        // Achievement: set an order as out of stock (correct or not)
        increaseAchievement(store.achievements, player.id, 'correctOutOfStock', 1);

        // If not fulfilled and out of stock, grant 3 points
        if (actualSlot === null) {
          scores.add(player.id, 3, 2);

          // Add to outOfStockOrders gallery
          gallery.outOfStockOrders[player.id].push({
            playerId: player.id,
            orderId,
            result: 'out-of-stock',
            guessedSlot: -1,
          });
          goodsDict[orderId].fulfilledId = player.id;
        } else {
          scores.add(player.id, -1, 3);

          gallery.wrongOutOfStockOrders[player.id].push({
            playerId: player.id,
            orderId,
            result: 'wrong-out-of-stock',
            guessedSlot: -1,
          });

          player.previousOrders.push(orderId);
        }

        return;
      }

      // Player just skipped the order
      gallery.skippedOrders[player.id].push({
        playerId: player.id,
        orderId,
        result: 'skipped',
        guessedSlot: null,
      });
      player.previousOrders.push(orderId);

      // Achievement: skipped an order
      increaseAchievement(store.achievements, player.id, 'skips', 1);
    });

    // Achievement: fulfilled at once
    pushAchievement(store.achievements, player.id, 'correctAtOnce', correctAtOnce);
  });

  return {
    ranking: scores.rank(players),
    gallery,
    ordersLeft: newOrdersLeft,
  };
};

export function distributeOrders(players: Players, goodsDict: Dictionary<Good>) {
  const playerList = utils.players.getListOfPlayers(players);
  const playerCount = playerList.length;

  // Get all available orders (not yet fulfilled)
  const availableOrders = orderBy(
    // First shuffle them all
    shuffle(Object.values(goodsDict).filter((good) => !good.fulfilledId)),
    // Then prioritize the orders that are in the warehouse
    [(o) => o.slot !== null],
    ['desc'],
  ).map((good) => good.id);

  const ordersPerPlayer = Math.floor(availableOrders.length / playerCount);

  // Initialize player orders and previousOrders sets for fast lookup
  const playerOrders: Record<UID, string[]> = {};
  const previousOrdersSets: Record<UID, Set<string>> = {};

  playerList.forEach((player) => {
    playerOrders[player.id] = [];
    previousOrdersSets[player.id] = new Set(player.previousOrders ?? []);
  });

  // Greedy assignment: for each order, assign to eligible player with fewest orders
  for (const orderId of availableOrders) {
    // Find eligible players (haven't seen this order and still need more orders)
    const eligiblePlayers = playerList.filter(
      (player) =>
        playerOrders[player.id].length < ordersPerPlayer && !previousOrdersSets[player.id].has(orderId),
    );

    if (eligiblePlayers.length > 0) {
      // Sort by number of orders (ascending) to maintain fairness
      eligiblePlayers.sort((a, b) => playerOrders[a.id].length - playerOrders[b.id].length);

      // Assign to player with fewest orders
      const selectedPlayer = eligiblePlayers[0];
      playerOrders[selectedPlayer.id].push(orderId);
    }
  }

  // Assign orders to players
  playerList.forEach((player) => {
    player.orders = playerOrders[player.id].sort();
  });

  return {
    ordersLeft: availableOrders.length,
  };
}
