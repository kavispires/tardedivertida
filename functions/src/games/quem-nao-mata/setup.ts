// Types
import type { FirebaseStateData, FirebaseStoreData } from './types';
// Constants
import { GAME_NAMES } from '../../utils/constants';
import { MAX_ROUNDS, QUEM_NAO_MATA_PHASES } from './constants';
// Services
import { cleanupStore, markGameAsComplete } from '../../services/game-session';
// Utils
import utils from '../../utils';

/**
 * [Setup Phase] - Initialize game and reset player properties
 * @param _store - The Firebase store data
 * @param _state - The Firebase state data
 * @param players - The players object
 */
export const prepareSetupPhase = async (
  _store: FirebaseStoreData,
  _state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  utils.players.removePropertiesFromPlayers(players, ['vote']);
  utils.players.unReadyPlayers(players);

  // Save
  return {
    update: {
      state: {
        phase: QUEM_NAO_MATA_PHASES.SETUP,
        players,
        round: {
          current: 0,
          total: MAX_ROUNDS,
        },
      },
    },
  };
};
/**
 * [Targeting Phase] - Players select their targets
 * @param _store - The Firebase store data
 * @param state - The Firebase state data
 * @param players - The players object
 */
export const prepareTargetingPhase = async (
  _store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  utils.players.removePropertiesFromPlayers(players, ['target']);
  utils.players.unReadyPlayers(players);

  if (!state.turn) {
    utils.players.addPropertiesToPlayers(players, {
      messages: [],
      alive: true,
    });
  }

  // Save
  return {
    update: {
      state: {
        phase: QUEM_NAO_MATA_PHASES.TARGETING,
        players,
        round: state.turn ? state.round : utils.game.increaseRound(state.round),
        turn: state.turn ? state.turn + 1 : 1,
      },
    },
  };
};
/**
 * [Standoff Phase] - Display targeting results
 * @param _store - The Firebase store data
 * @param _state - The Firebase state data
 * @param players - The players object
 */
export const prepareStandoffPhase = async (
  _store: FirebaseStoreData,
  _state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  // TODO: Resolve votes

  // Save
  return {
    update: {
      state: {
        phase: QUEM_NAO_MATA_PHASES.STANDOFF,
        players,
      },
    },
  };
};
/**
 * [Duel Phase] - Resolve duels between players
 * @param _store - The Firebase store data
 * @param _state - The Firebase state data
 * @param players - The players object
 */
export const prepareDuelPhase = async (
  _store: FirebaseStoreData,
  _state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  // Save
  return {
    update: {
      state: {
        phase: QUEM_NAO_MATA_PHASES.DUEL,
        players,
      },
    },
  };
};
/**
 * [Resolution Phase] - Display duel results
 * @param _store - The Firebase store data
 * @param _state - The Firebase state data
 * @param players - The players object
 */
export const prepareResolutionPhase = async (
  _store: FirebaseStoreData,
  _state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  // Save
  return {
    update: {
      state: {
        phase: QUEM_NAO_MATA_PHASES.RESOLUTION,
        players,
      },
    },
  };
};

/**
 * [Game Over Phase] - Finalize game and save results
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
  // Save
  const winners = utils.players.determineWinners(players);

  await markGameAsComplete(gameId);

  await utils.user.saveGameToUsers({
    gameName: GAME_NAMES.QUEM_NAO_MATA,
    gameId,
    startedAt: store.createdAt,
    players,
    winners,
    achievements: [],
    language: store.language,
  });

  return {
    update: {
      store: cleanupStore(store, []),
    },
    set: {
      state: {
        phase: QUEM_NAO_MATA_PHASES.GAME_OVER,
        players,
        round: state.round,
        gameEndedAt: Date.now(),
        winners,
      },
    },
  };
};
