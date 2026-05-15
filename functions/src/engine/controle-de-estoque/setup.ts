// Constants
import {
  CONTROLE_DE_ESTOQUE_PHASES,
  MIN_ROUNDS,
  COUNTS_BY_PLAYER_COUNT,
  STARTING_GOODS_CELLS,
  WAREHOUSE_SIZE,
  OUTCOME,
  EVENT_TYPE,
} from './constants';
import { GAME_NAMES } from '../../utils/constants';
import { keyBy, sample, sampleSize, shuffle } from 'lodash';
// Types
import type {
  FirebaseStateData,
  FirebaseStoreData,
  Good,
  ResourceData,
  Status,
  WarehouseSlot,
} from './types';
import type { BossIdeaCard } from '../../types/tdr';
// Utils
import utils from '../../utils';
// Internal
import {
  buildRanking,
  concealAllGoods,
  concealGoodsForEvent,
  updateAvailableSlotsInWarehouse,
} from './helpers';
import { BOSS_IDEAS } from './data';

/**
 * Setup phase - initializes game state and resources
 * @param _store - The Firebase store data
 * @param _state - The Firebase state data
 * @param players - The players object
 * @param resourceData - Resource data
 */
export const prepareSetupPhase = async (
  _store: FirebaseStoreData,
  _state: FirebaseStateData,
  players: Players,
  resourceData: ResourceData,
): Promise<SaveGamePayload> => {
  const achievements = utils.achievements.setup(players, {
    attempts: 0,
    correctAtOnce: 0,
    skips: 0,
    outOfStock: 0,
    outOfStockFulfillment: 0,
  });

  // Get player count and determine goods counts from COUNTS_BY_PLAYER_COUNT
  const playerCount = utils.players.getPlayerCount(players);
  const counts = COUNTS_BY_PLAYER_COUNT[playerCount as keyof typeof COUNTS_BY_PLAYER_COUNT];

  // Gather goods and build dictionary
  // Total goods includes: initialGoods + goodsOnFirstRound + (goodsPerRound * 4) + outOfStock
  const totalGoodsNeeded = counts.total + counts.outOfStock;
  const allGoods = sampleSize(resourceData.goodsIds, totalGoodsNeeded);

  // Separate initial goods (will be pre-placed), placeable goods (will be placed during game), and out-of-stock goods
  const initialGoodsIds = allGoods.slice(0, counts.initialGoods);
  const placeableGoodsIds = allGoods.slice(counts.initialGoods, counts.total);
  const extraGoods = allGoods.slice(counts.total);

  const goodsDict = keyBy(
    allGoods.map((goodId) => {
      const good: Good = {
        id: goodId,
        slot: null,
        exposed: false,
        orientation: sample([0, 0, 0, 90, 180, 270]),
      };
      return good;
    }),
    'id',
  );

  // Build grid
  const warehouseGrid = keyBy(
    utils.helpers.makeArray(49).map((id) => {
      const slot: WarehouseSlot = {
        id,
        goodId: null,
        available: false,
        temporaryName: null,
        orderId: null,
        status: 'idle',
      };
      return slot;
    }),
    'id',
  );

  // Place initial goods at STARTING_GOODS_CELLS positions
  STARTING_GOODS_CELLS.forEach(([row, col], index) => {
    const slotId = row * WAREHOUSE_SIZE + col;
    const goodId = initialGoodsIds[index];
    warehouseGrid[slotId].goodId = goodId;
    goodsDict[goodId].slot = slotId;
    goodsDict[goodId].exposed = true; // Initial goods are visible during THE_WAREHOUSE phase
  });

  // Create game order for supervisor rotation
  const { gameOrder } = utils.turnOrder.create(players);

  // Calculate total rounds (minimum 5 rounds)
  const totalRounds = MIN_ROUNDS;

  // Determine boss ideas making the First day always the first idea
  const bossIdeas: BossIdeaCard[] = [resourceData.allBossIdeas.FIRST_DAY];
  bossIdeas.push(
    ...sampleSize(
      Object.values(resourceData.allBossIdeas).filter((idea) => idea.id !== BOSS_IDEAS.FIRST_DAY.id),
      totalRounds - 1,
    ),
  );

  // Save
  return {
    update: {
      store: {
        achievements,
        extraGoods,
        bossIdeas,
      },
      state: {
        phase: CONTROLE_DE_ESTOQUE_PHASES.SETUP,
        round: {
          current: 0,
          total: totalRounds,
        },
        turnOrder: gameOrder,
        supervisorId: gameOrder.at(-1) ?? null,
        warehouseGrid,
        goodsDict,
        availableGoods: placeableGoodsIds,
      },
    },
  };
};

/**
 * The Warehouse phase - players view the warehouse and prepare for placement
 * @param _store - The Firebase store data
 * @param state - The Firebase state data
 * @param players - The players object
 */
export const prepareTheWarehousePhase = async (
  _store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  // Unready all players (they all need to press ready to proceed)
  utils.players.unReadyPlayers(players);

  // Expose initial goods for viewing
  (Object.values(state.goodsDict) as Good[]).forEach((good) => {
    if (good.slot !== null) {
      good.exposed = true;
    }
  });

  // Save
  return {
    update: {
      state: {
        phase: CONTROLE_DE_ESTOQUE_PHASES.THE_WAREHOUSE,
        players,
        goodsDict: state.goodsDict,
      },
    },
  };
};

/**
 * Good Placement phase - players place goods in the warehouse grid
 * @param store - The Firebase store data
 * @param state - The Firebase state data
 * @param players - The players object
 */
export const prepareGoodPlacementPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  // Get player count and counts configuration
  const playerCount = utils.players.getPlayerCount(players);
  const counts = COUNTS_BY_PLAYER_COUNT[playerCount as keyof typeof COUNTS_BY_PLAYER_COUNT];
  let round: Round = state.round;

  // Get supervisor for this turn (cycles through turnOrder)
  const previousSupervisorId = state.supervisorId ?? null;
  const supervisorId = utils.turnOrder.getNextPlayerId(state.turnOrder, previousSupervisorId);
  // Ready everybody but the supervisor
  utils.players.readyPlayers(players, supervisorId);

  const status: Status = state.status ?? {
    outcome: OUTCOME.NEW_IDEA,
    progress: 0,
    goal: counts.goodsPerRound,
    stocked: counts.initialGoods,
    total: counts.total,
  };

  // Get the next good to place from availableGoods
  const availableGoods: UID[] = state.availableGoods;

  const currentGoodId = state.currentGoodId ?? null;
  const goodsDict: Dictionary<Good> = state.goodsDict;
  const warehouseGrid: Dictionary<WarehouseSlot> = state.warehouseGrid;

  // SETUP FIRST ROUND
  if (round.current === 0) {
    round = utils.game.increaseRound(round);

    // The 1st round's goods might be a different amount
    status.goal = counts.goodsOnFirstRound;

    // Get boss idea for current round
    const bossIdea = store.bossIdeas[round.current - 1];

    // Animate initial goods being concealed before starting the first round
    const event = concealAllGoods(goodsDict, null, EVENT_TYPE.CONCEAL);
    updateAvailableSlotsInWarehouse(warehouseGrid, bossIdea.id);

    const newGoodId = state.availableGoods.pop() ?? null;

    // Save
    return {
      update: {
        state: {
          phase: CONTROLE_DE_ESTOQUE_PHASES.GOOD_PLACEMENT,
          players,
          round,
          bossIdea,
          warehouseGrid,
          goodsDict,
          supervisorId,
          availableGoods,
          currentGoodId: newGoodId,
          event,
          status,
          selectedWarehouseSlot: null,
        },
      },
    };
  }

  // Animate initial goods being concealed before starting the first round
  const event = concealGoodsForEvent(
    goodsDict,
    warehouseGrid,
    currentGoodId,
    state.selectedWarehouseSlot,
    previousSupervisorId,
    EVENT_TYPE.CONCEAL,
  );

  // Update statuses
  status.outcome = OUTCOME.CONTINUE;
  status.progress += 1;
  status.stocked += 1;

  // END OF PHASE
  if (status.progress >= status.goal && currentGoodId === null) {
    // Override status for end of phase
    status.outcome = OUTCOME.END_PHASE;

    // Save
    return {
      update: {
        state: {
          phase: CONTROLE_DE_ESTOQUE_PHASES.GOOD_PLACEMENT,
          players,
          warehouseGrid,
          goodsDict,
          supervisorId,
          currentGoodId: null,
          availableGoods,
          event,
          status,
          selectedWarehouseSlot: null,
        },
      },
    };
  }

  const newGoodId = state.availableGoods.pop() ?? null;

  // SETUP NEW ROUND
  if (status.progress >= status.goal) {
    round = utils.game.increaseRound(round);

    // Override status for new round
    status.progress = 0;
    status.goal = counts.goodsPerRound;
    status.outcome = OUTCOME.NEW_IDEA;

    // Get boss idea for current round
    const bossIdea = store.bossIdeas[round.current - 1];

    // Update warehouse with available slots
    updateAvailableSlotsInWarehouse(warehouseGrid, bossIdea.id);

    return {
      update: {
        state: {
          phase: CONTROLE_DE_ESTOQUE_PHASES.GOOD_PLACEMENT,
          players,
          round,
          bossIdea,
          warehouseGrid,
          goodsDict,
          supervisorId,
          currentGoodId: newGoodId,
          availableGoods,
          event,
          status,
          selectedWarehouseSlot: null,
        },
      },
    };
  }

  const bossIdea: BossIdeaCard = state.bossIdea;

  // Update warehouse with available slots
  updateAvailableSlotsInWarehouse(warehouseGrid, bossIdea.id);

  // CONTINUE
  // Save
  return {
    update: {
      state: {
        phase: CONTROLE_DE_ESTOQUE_PHASES.GOOD_PLACEMENT,
        players,
        warehouseGrid,
        goodsDict,
        supervisorId,
        currentGoodId: newGoodId,
        availableGoods,
        event,
        status,
        selectedWarehouseSlot: null,
      },
    },
  };
};

/**
 * Placement Confirmation phase - supervisor confirms or rejects placements
 * @param store - The Firebase store data
 * @param state - The Firebase state data
 * @param players - The players object
 */
export const preparePlacementConfirmationPhase = async (
  _store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  utils.players.unReadyPlayers(players, state.supervisorId);

  // Remove the placed good from availableGoods
  const availableGoods = state.availableGoods.slice(1);

  // Save
  return {
    update: {
      state: {
        phase: CONTROLE_DE_ESTOQUE_PHASES.PLACEMENT_CONFIRMATION,
        players,
        stocked: state.stocked + 1,
        availableGoods,
      },
    },
  };
};

/**
 * Fulfillment phase - players fulfill orders from the warehouse
 * @param store - The Firebase store data
 * @param state - The Firebase state data
 * @param players - The players object
 */
export const prepareFulfillmentPhase = async (
  _store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  utils.players.unReadyPlayers(players);

  // When entering fulfillment phase, reset rounds to 3 and disable the entire warehouse
  const warehouseGrid: Dictionary<WarehouseSlot> = state.warehouseGrid;
  const round: Round = {
    current: 0,
    total: 3,
  };

  Object.values(warehouseGrid).forEach((slot) => {
    slot.available = false;
  });

  utils.game.increaseRound(round);

  const availableOrders = Object.values<Dictionary<Good>>(state.goodsDict)
    .filter((good) => {
      if (typeof good.slot === 'number') {
        return warehouseGrid[good.slot].status !== 'correct';
      }
      return false;
    })
    .map((good) => good.id);

  utils.players.dealItemsToPlayers(
    players,
    shuffle(availableOrders),
    Math.floor(availableOrders.length / utils.players.getPlayerCount(players)),
    'orders',
  );

  utils.players.removePropertiesFromPlayers(players, ['fulfillments']);

  // Save
  return {
    update: {
      state: {
        phase: CONTROLE_DE_ESTOQUE_PHASES.FULFILLMENT,
        players,
        round,
        warehouseGrid,
      },
      stateCleanup: [
        'turnNumber',
        'supervisorId',
        'currentGoodId',
        'availableGoods',
        'bossIdea',
        'gallery',
        'ranking',
      ],
    },
  };
};

/**
 * Results phase - calculates scores and rankings for the round
 * @param store - The Firebase store data
 * @param state - The Firebase state data
 * @param players - The players object
 */
export const prepareResultsPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  utils.players.unReadyPlayers(players);

  const { gallery, ranking } = buildRanking(players, state.goodsDict, state.warehouseGrid, store);

  // Save
  return {
    update: {
      store,
      state: {
        phase: CONTROLE_DE_ESTOQUE_PHASES.RESULTS,
        players,
        gallery,
        ranking,
        goodsDict: state.goodsDict,
        warehouseGrid: state.warehouse,
      },
    },
  };
};

/**
 * Game Over phase - determines winners and saves game data
 * @param gameId - The game session ID
 * @param store - The Firebase store data
 * @param state - The Firebase state data
 * @param players - The players object
 */
export const prepareGameOverPhase = async (
  gameId: UID,
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  const winners = utils.players.determineWinners(players);

  // const achievements = getAchievements(store);
  const achievements = [];

  await utils.firestore.markGameAsComplete(gameId);

  await utils.user.saveGameToUsers({
    gameName: GAME_NAMES.CONTROLE_DE_ESTOQUE,
    gameId,
    startedAt: store.createdAt,
    players,
    winners,
    achievements,
    language: store.language,
  });

  // Save data
  // await saveData(store.language, store.pastClues, store.options.imageGrid);

  utils.players.cleanup(players, []);

  return {
    update: {
      storeCleanup: utils.firestore.cleanupStore(store, []),
    },
    set: {
      state: {
        phase: CONTROLE_DE_ESTOQUE_PHASES.GAME_OVER,
        round: state.round,
        gameEndedAt: Date.now(),
        winners,
        players,
        achievements,
      },
    },
  };
};
