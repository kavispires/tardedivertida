// Constants
import { MAX_ROUNDS, QUEM_NAO_MATA_PHASES } from './constants';
// Types
import type { FirebaseStateData, FirebaseStoreData } from './types';
// Utils
import utils from '../../utils';

export const prepareSetupPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  utils.players.removePropertiesFromPlayers(players, ['vote']);
  utils.players.unReadyPlayers(players);

  // Save
  return {
    update: {
      players,
      state: {
        phase: QUEM_NAO_MATA_PHASES.SETUP,
        round: {
          current: 0,
          total: MAX_ROUNDS,
        },
      },
    },
  };
};
export const prepareTargetingPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
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
      players,
      state: {
        phase: QUEM_NAO_MATA_PHASES.TARGETING,
        round: state.turn ? state.round : utils.helpers.increaseRound(state.round),
        turn: state.turn ? state.turn + 1 : 1,
      },
    },
  };
};
export const prepareStandoffPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  // TODO: Resolve votes

  // Save
  return {
    update: {
      players,
      state: {
        phase: QUEM_NAO_MATA_PHASES.STANDOFF,
      },
    },
  };
};
export const prepareDuelPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  // Save
  return {
    update: {
      players,
      state: {
        phase: QUEM_NAO_MATA_PHASES.DUEL,
      },
    },
  };
};
export const prepareResolutionPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  // Save
  return {
    update: {
      players,
      state: {
        phase: QUEM_NAO_MATA_PHASES.RESOLUTION,
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
  // Save
  const winners = utils.players.determineWinners(players);

  await utils.firebase.markGameAsComplete(gameId);

  return {
    set: {
      players,
      state: {
        phase: QUEM_NAO_MATA_PHASES.GAME_OVER,
        round: state.round,
        gameEndedAt: Date.now(),
        winners,
      },
    },
  };
};
