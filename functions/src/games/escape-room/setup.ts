// Types
import type { FirebaseStateData, FirebaseStoreData, ResourceData } from './types';
// Constants
import { GAME_NAMES } from '../../constants/games';
import { ESCAPE_ROOM_PHASES, MISSIONS_COUNT } from './constants';
// Services
import { cleanupStore, markGameAsComplete } from '../../services/game-session';
// Utils
import utils from '../../utils_LEGACY';

/**
 * Setup phase - initializes game state and resources
 * @param store - The Firebase store data
 * @param _state - The Firebase state data
 * @param players - The players object
 * @param resourceData - Resource data
 */
export const prepareSetupPhase = async (
  store: FirebaseStoreData,
  _state: FirebaseStateData,
  players: Players,
  resourceData: ResourceData,
): Promise<SaveGamePayload> => {
  // TODO: Implement achievements
  // const achievements = utils.achievements.setup(players, {
  //   lead: 0,
  //   first: 0,
  //   complete: 0,
  //   help: 0,
  // });

  const round: Round = {
    current: 0,
    total: MISSIONS_COUNT[store?.options?.duration ?? 'default'],
  };

  // Determine player order (who gets mission #1, #2, etc)
  const { gameOrder } = utils.turnOrder.create(players);

  // TODO: Deal cards
  console.log('Resource Data:', resourceData);

  // Save
  return {
    update: {
      store: {
        deck: [],
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

/**
 * Mission phase - players attempt to complete the current mission
 * @param store - The Firebase store data
 * @param _state - The Firebase state data
 * @param players - The players object
 */
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

/**
 * Mission Evaluation phase - evaluates success of the mission attempt
 * @param store - The Firebase store data
 * @param _state - The Firebase state data
 * @param players - The players object
 */
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

/**
 * Results phase - calculates scores and rankings
 * @param store - The Firebase store data
 * @param _state - The Firebase state data
 * @param players - The players object
 */
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
  const achievements = []; // TODO: implement achievements

  await markGameAsComplete(gameId);

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
      storeCleanup: cleanupStore(store, []),
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
