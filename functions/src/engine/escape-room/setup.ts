// Constants
import { ESCAPE_ROOM_PHASES, MISSIONS_COUNT } from './constants';
import { GAME_NAMES } from '../../utils/constants';
// Types
import type { FirebaseStateData, FirebaseStoreData, ResourceData } from './types';
// Utils
import utils from '../../utils';
// Internal

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
    lead: 0,
    first: 0,
    complete: 0,
    help: 0,
  });

  const round: Round = {
    current: 0,
    total: MISSIONS_COUNT[store?.options?.duration ?? 'default'],
  };

  // Determine player order (who gets mission #1, #2, etc)
  const { gameOrder } = utils.players.buildGameOrder(players);

  // TODO: Deal cards
  console.log('Resource Data:', resourceData);

  // Save
  return {
    update: {
      store: {
        deck: [],
        achievements,
      },
      state: {
        phase: ESCAPE_ROOM_PHASES.SETUP,
        players,
        round,
        gameOrder,
      },
    },
  };
};

export const prepareMissionPhase = async (
  store: FirebaseStoreData,
  _state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  // Unready players
  utils.players.unReadyPlayers(players);

  // Save
  return {
    update: {
      state: {
        phase: ESCAPE_ROOM_PHASES.MISSION,
        players,
        deck: store.deck,
      },
    },
  };
};

export const prepareMissionEvaluationPhase = async (
  store: FirebaseStoreData,
  _state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  // Unready players
  utils.players.unReadyPlayers(players);

  // Save
  return {
    update: {
      state: {
        phase: ESCAPE_ROOM_PHASES.MISSION_EVALUATION,
        players,
        deck: store.deck,
      },
    },
  };
};

export const prepareResultsPhase = async (
  store: FirebaseStoreData,
  _state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  // Unready players
  utils.players.unReadyPlayers(players);

  // Save
  return {
    update: {
      state: {
        phase: ESCAPE_ROOM_PHASES.RESULTS,
        players,
        deck: store.deck,
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
  const achievements = []; // TODO: implement achievements

  await utils.firestore.markGameAsComplete(gameId);

  await utils.user.saveGameToUsers({
    gameName: GAME_NAMES.ESCAPE_ROOM,
    gameId,
    startedAt: store.createdAt,
    players,
    winners,
    achievements,
    language: store.language,
  });

  utils.players.cleanup(players, []);

  return {
    update: {
      storeCleanup: utils.firestore.cleanupStore(store, []),
    },
    set: {
      state: {
        phase: ESCAPE_ROOM_PHASES.GAME_OVER,
        round: state.round,
        gameEndedAt: Date.now(),
        winners,
        players,
        achievements,
      },
    },
  };
};
