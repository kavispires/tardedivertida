import { keyBy, sample, sampleSize } from 'lodash';
// Types
import type { BossIdeaCardData } from '../../types/tdr';
import type {
  FirebaseStateData,
  FirebaseStoreData,
  Good,
  ResourceData,
  Status,
  WarehouseSlot,
} from './types';
// Constants
import { GAME_NAMES } from '../../constants/games';
import {
  CONTROLE_DE_ESTOQUE_PHASES,
  MIN_ROUNDS,
  COUNTS_BY_PLAYER_COUNT,
  STARTING_GOODS_CELLS,
  WAREHOUSE_SIZE,
  OUTCOME,
  EVENT_TYPE,
} from './constants';
// Services
import { cleanupStore, markGameAsComplete } from '../../services/game-session';
// Utils
import utils from '../../utils_LEGACY';
// Internal
import { calculateAchievements, setupAchievements } from './achievements';
import {
  buildRanking,
  concealAllGoods,
  concealGoodsForEvent,
  distributeOrders,
  updateAvailableSlotsInWarehouse,
} from './helpers';

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
  const achievements = setupAchievements(utils.players.getListOfPlayersIds(players));

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
  const bossIdeas: BossIdeaCardData[] = [resourceData.allBossIdeas.FIRST_DAY];
  // Except for the type default, separate the boss ideas by type (excluding any disabled ones), then randomly choose of of each type. After this pre-selection, use sampleSize to randomly get the remaining boss ideas from the pool until reaching the total rounds needed.
  const bossIdeasByType: Dictionary<BossIdeaCardData[]> = {};
  Object.values(resourceData.allBossIdeas).forEach((idea) => {
    if (idea.type !== 'default' && !idea.disabled) {
      if (!bossIdeasByType[idea.type]) {
        bossIdeasByType[idea.type] = [];
      }
      bossIdeasByType[idea.type].push(idea);
    }
  });

  const preSelection: BossIdeaCardData[] = [];

  Object.values(bossIdeasByType).forEach((ideas) => {
    const randomIdea = sample(ideas);
    if (randomIdea) {
      preSelection.push(randomIdea);
    }
  });

  bossIdeas.push(...sampleSize(preSelection, totalRounds - 1));

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
    updateAvailableSlotsInWarehouse(warehouseGrid, bossIdea.id, status);

    const newGoodId = state.availableGoods.pop() ?? null;

    // Save
    return {
      update: {
        state: {
          phase: CONTROLE_DE_ESTOQUE_PHASES.GOOD_PLACEMENT,
          players,
          round,
          bossIdea,
          previousBossIdea: null,
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

  const newGoodId = state.availableGoods.pop() ?? null;

  // SETUP NEW ROUND
  if (status.progress >= status.goal) {
    const previousBossIdea = state.bossIdea;
    round = utils.game.increaseRound(round);

    // Override status for new round
    status.progress = 0;
    status.goal = counts.goodsPerRound;
    status.outcome = OUTCOME.NEW_IDEA;
    delete status.additionalInfo;

    // Get boss idea for current round
    const bossIdea = store.bossIdeas[round.current - 1];

    // Update warehouse with available slots
    updateAvailableSlotsInWarehouse(warehouseGrid, bossIdea.id, status);

    return {
      update: {
        state: {
          phase: CONTROLE_DE_ESTOQUE_PHASES.GOOD_PLACEMENT,
          players,
          round,
          bossIdea,
          previousBossIdea,
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

  const bossIdea: BossIdeaCardData = state.bossIdea;

  // Update warehouse with available slots
  updateAvailableSlotsInWarehouse(warehouseGrid, bossIdea.id, status);

  // CONTINUE
  // Save
  return {
    update: {
      state: {
        phase: CONTROLE_DE_ESTOQUE_PHASES.GOOD_PLACEMENT,
        players,
        warehouseGrid,
        previousBossIdea: null,
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
  const warehouseGrid: Dictionary<WarehouseSlot> = state.warehouseGrid;
  const goodsDict: Dictionary<Good> = state.goodsDict;

  // FIRST ROUND OF FULFILLMENT
  if (state.phase === CONTROLE_DE_ESTOQUE_PHASES.GOOD_PLACEMENT) {
    // Update statuses
    const status: Status = state.status;
    status.outcome = OUTCOME.END_PHASE;
    status.progress += 1;
    status.stocked += 1;

    // Animate initial goods being concealed before starting the first round
    const event = concealGoodsForEvent(
      goodsDict,
      warehouseGrid,
      state.currentGoodId,
      state.selectedWarehouseSlot,
      state.supervisorId,
      EVENT_TYPE.CONCEAL,
    );

    // When entering fulfillment phase, reset rounds to 3 and disable the entire warehouse
    const round: Round = {
      current: 1,
      total: 3,
    };

    Object.values(warehouseGrid).forEach((slot) => {
      slot.available = false;
    });

    utils.players.addPropertiesToPlayers(players, { fulfillments: {}, previousOrders: [] });

    const { ordersLeft } = distributeOrders(players, state.goodsDict);

    // Save
    return {
      update: {
        state: {
          phase: CONTROLE_DE_ESTOQUE_PHASES.FULFILLMENT,
          players,
          round,
          goodsDict,
          warehouseGrid,
          ordersLeft,
          event,
          lastBossIdea: state.bossIdea,
        },
        stateCleanup: [
          'bossIdea',
          'selectedWarehouseSlot',
          'supervisorId',
          'availableGoods',
          'gallery',
          'ranking',
        ],
      },
    };
  }

  // SECOND AND THIRD ROUND OF FULFILLMENT

  const { ordersLeft } = distributeOrders(players, state.goodsDict);

  utils.players.removePropertiesFromPlayers(players, ['fulfillments']);

  // Save
  return {
    update: {
      state: {
        phase: CONTROLE_DE_ESTOQUE_PHASES.FULFILLMENT,
        players,
        round: utils.game.increaseRound(state.round),
        warehouseGrid,
        ordersLeft,
      },
      stateCleanup: [
        'gallery',
        'ranking',
        'status',
        'event',
        'lastBossIdea',
        'currentGoodId',
        'previousBossIdea',
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

  const { gallery, ranking, ordersLeft } = buildRanking(
    players,
    state.goodsDict,
    state.warehouseGrid,
    state.ordersLeft,
    state.round.current,
    store,
  );

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
        warehouseGrid: state.warehouseGrid,
        ordersLeft,
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

  const achievements = calculateAchievements(store.achievements);

  await markGameAsComplete(gameId);

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
      storeCleanup: cleanupStore(store, []),
    },
    set: {
      state: {
        phase: CONTROLE_DE_ESTOQUE_PHASES.GAME_OVER,
        round: state.round,
        gameEndedAt: Date.now(),
        winners,
        players,
        achievements,
        goodsDict: state.goodsDict,
        warehouseGrid: state.warehouseGrid,
      },
    },
  };
};
