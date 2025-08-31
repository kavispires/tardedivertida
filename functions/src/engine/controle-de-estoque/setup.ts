// Constants
import { CONTROLE_DE_ESTOQUE_PHASES, OUT_OF_STOCK_GOODS, MIN_ROUNDS, TOTAL_GOODS } from './constants';
import { GAME_NAMES } from '../../utils/constants';
// Types
import type { FirebaseStateData, FirebaseStoreData, Good, ResourceData, WarehouseSlot } from './types';
import type { BossIdeaCard } from '../../types/tdr';
// Utils
import utils from '../../utils';
// Internal
import {
  buildRanking,
  concealAllGoods,
  updateAvailableSlotsInWarehouse,
  updateEdgeAvailability,
} from './helpers';

/**
 * Setup
 * Build the card deck
 * Resets previous changes to the store
 * @returns
 */
export const prepareSetupPhase = async (
  store: FirebaseStoreData,
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

  // Gather goods and build dictionary
  // There should be extra goods for the out-of-stock mechanic during the fulfillment phase
  const goods = utils.game.getRandomItems(resourceData.goodsIds, TOTAL_GOODS + OUT_OF_STOCK_GOODS);
  const placeableGoods = utils.game.getRandomItems(goods, TOTAL_GOODS);
  const extraGoods = goods.filter((good) => !placeableGoods.includes(good));
  const goodsDict = utils.helpers.buildDictionaryFromList(
    goods.map((goodId) => {
      const good: Good = {
        id: goodId,
        slot: null,
        exposed: false,
      };
      return good;
    }),
    'id',
  );

  // Build grid and make center slot available to start the game
  const warehouseGrid = utils.helpers.buildDictionaryFromList(
    utils.game.makeArray(49).map((id) => {
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

  // Calculate rounds and distribute goods
  // Each player must be the floor supervisor at least once with a minimum of 5 rounds
  const { gameOrder } = utils.players.buildGameOrder(players);
  const totalRounds = Math.max(gameOrder.length, MIN_ROUNDS);

  // Determine bosses ideas making the First day always the first idea
  const bossIdeas: BossIdeaCard[] = [resourceData.allBossIdeas.FIRST_DAY];
  bossIdeas.push(
    ...utils.game.getRandomItems(
      Object.values(resourceData.allBossIdeas).filter((idea) => idea.id !== 'FIRST_DAY'),
      totalRounds - 1,
    ),
  );

  // Distribute the goods for each round as equal as possible
  const goodsPerRound = Math.ceil(placeableGoods.length / totalRounds);
  const roundsGoods: Record<number, string[]> = {};
  for (let i = 0; i < totalRounds; i++) {
    roundsGoods[i] = placeableGoods.slice(i * goodsPerRound, (i + 1) * goodsPerRound);
  }

  // Save
  return {
    update: {
      store: {
        achievements,
        extraGoods,
        bossIdeas,
        roundsGoods,
      },
      state: {
        phase: CONTROLE_DE_ESTOQUE_PHASES.SETUP,
        round: {
          current: 0,
          total: totalRounds,
        },
        gameOrder,
        warehouseGrid,
        goodsDict,
        stocked: 0,
      },
    },
  };
};

export const prepareGoodPlacementPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  // Start game if it is the first round or all rounds goods have been placed
  if (!state.roundGoods || state.roundsGoodIndex >= state.roundGoods.length - 1) {
    const currentRound = state.round.current + 1;
    const supervisorId = utils.players.getActivePlayer(state.gameOrder, currentRound);

    // Ready everybody but the supervisor
    utils.players.readyPlayers(players, supervisorId);

    // Get new boss id and sets of items
    const bossIdea = store.bossIdeas[currentRound - 1];
    const roundGoods = store.roundsGoods[currentRound - 1];
    const roundsGoodIndex = 0;

    // Update warehouse with available slots
    bossIdea.id === 'WALLS'
      ? updateEdgeAvailability(state.warehouseGrid)
      : updateAvailableSlotsInWarehouse(state.warehouseGrid);

    if (currentRound === 1) {
      state.warehouseGrid[24].available = true;
      state.warehouseGrid[24].temporaryName = '?';
    }

    // Conceal all goods
    concealAllGoods(state.goodsDict);

    // Save
    return {
      update: {
        state: {
          phase: CONTROLE_DE_ESTOQUE_PHASES.GOOD_PLACEMENT,
          players,
          round: {
            current: currentRound,
            total: state.round.total,
          },
          bossIdea,
          warehouseGrid: state.warehouseGrid,
          goodsDict: state.goodsDict,
          supervisorId,
          roundGoods,
          roundsGoodIndex,
        },
      },
    };
  }

  const supervisorId = state.supervisorId;
  // Ready everybody but the supervisor
  utils.players.readyPlayers(players, supervisorId);

  // Update warehouse with available slots
  state.bossIdea.id === 'WALLS'
    ? updateEdgeAvailability(state.warehouseGrid)
    : updateAvailableSlotsInWarehouse(state.warehouseGrid);

  // Conceal all goods
  concealAllGoods(state.goodsDict);

  // Save
  return {
    update: {
      state: {
        phase: CONTROLE_DE_ESTOQUE_PHASES.GOOD_PLACEMENT,
        players,
        warehouseGrid: state.warehouseGrid,
        goodsDict: state.goodsDict,
        roundsGoodIndex: state.roundsGoodIndex + 1,
      },
    },
  };
};

export const preparePlacementConfirmationPhase = async (
  _store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  utils.players.unReadyPlayers(players, state.supervisorId);

  // Save
  return {
    update: {
      state: {
        phase: CONTROLE_DE_ESTOQUE_PHASES.PLACEMENT_CONFIRMATION,
        players,
        stocked: state.stocked + 1,
      },
    },
  };
};

export const prepareFulfillmentPhase = async (
  _store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  utils.players.unReadyPlayers(players);

  // When the fulfillment phases, rounds resets to 3 and disabled the entire warehouse
  const warehouseGrid: Dictionary<WarehouseSlot> = state.warehouseGrid;
  const round: Round = state.round;
  if (state.roundsGoodIndex) {
    round.current = 0;
    round.total = 3;
    Object.values(warehouseGrid).forEach((slot) => {
      slot.available = false;
    });
  }
  utils.helpers.increaseRound(round);

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
    utils.game.shuffle(availableOrders),
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
      stateCleanup: ['roundsGoodIndex', 'supervisorId', 'roundGoods', 'bossIdea', 'gallery', 'ranking'],
    },
  };
};

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

export const prepareGameOverPhase = async (
  gameId: GameId,
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
