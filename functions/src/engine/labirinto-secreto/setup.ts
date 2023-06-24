// Constants
import { CARDS_PER_ROUND, LABIRINTO_SECRETO_PHASES } from './constants';
import { GAME_NAMES } from '../../utils/constants';
// Types
import type { FirebaseStateData, FirebaseStoreData, ResourceData } from './types';
// Utils
import utils from '../../utils';
// Internal
import { buildForest, buildPaths, distributeCards } from './helpers';

/**
 * Setup
 * Build the card deck
 * Resets previous changes to the store
 * @returns
 */
export const prepareSetupPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
  resourceData: ResourceData
): Promise<SaveGamePayload> => {
  // Build forest
  const forest = buildForest(resourceData.forestCards);

  // Build player paths
  buildPaths(players);

  // Build player hands
  distributeCards(store, players, resourceData.allCards);

  const { gameOrder } = utils.players.buildGameOrder(players);

  // const achievements = utils.achievements.setup(players, store, {
  //   // matches: 0,
  // });

  // Save
  return {
    update: {
      store,
      state: {
        phase: LABIRINTO_SECRETO_PHASES.SETUP,
        players,
        forest,
        turnOrder: gameOrder,
      },
    },
  };
};

export const prepareMapBuildingPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  // Determine player order

  // Unready players
  utils.players.unReadyPlayers(players);

  // Deal cards
  utils.deck.deal(store, players, CARDS_PER_ROUND);

  // Save
  return {
    update: {
      store,
      state: {
        phase: LABIRINTO_SECRETO_PHASES.MAP_BUILDING,
        players,
      },
      stateCleanup: [],
    },
  };
};

export const preparePathFollowingPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  // Unready players
  utils.players.unReadyPlayers(players);

  // Save
  return {
    update: {
      state: {
        phase: LABIRINTO_SECRETO_PHASES.PATH_FOLLOWING,
        players,
      },
    },
  };
};

export const prepareResultsPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  // Save
  return {
    update: {
      store: {},
      state: {
        phase: LABIRINTO_SECRETO_PHASES.RESULTS,
        players,
      },
    },
  };
};

export const prepareGameOverPhase = async (
  gameId: GameId,
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  const winners = utils.players.determineWinners(players);

  // const achievements = getAchievements(store);

  await utils.firebase.markGameAsComplete(gameId);

  await utils.user.saveGameToUsers({
    gameName: GAME_NAMES.LABIRINTO_SECRETO,
    gameId,
    startedAt: store.createdAt,
    players,
    winners,
    achievements: [],
    language: store.language,
  });

  utils.players.cleanup(players, []);

  return {
    update: {
      storeCleanup: utils.firebase.cleanupStore(store, []),
    },
    set: {
      state: {
        phase: LABIRINTO_SECRETO_PHASES.GAME_OVER,
        players,
        round: state.round,
        gameEndedAt: Date.now(),
        winners,
        // achievements,
      },
    },
  };
};
