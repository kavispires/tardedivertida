// Constants
import { CRIMES_HEDIONDOS_PHASES } from './constants';
// Types
import { FirebaseStateData, FirebaseStoreData, ResourceData } from './types';
import { Players, SaveGamePayload } from '../../utils/types';
// Utils
import * as utils from '../../utils/helpers';
// import * as firebaseUtils from '../../utils/firebase';
// Internal

/**
 * Setup
 * ???
 * Resets previous changes to the store
 * @returns
 */
export const prepareSetupPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
  resourceData: ResourceData
): Promise<SaveGamePayload> => {
  // Build weapon and evidence decks
  console.log(resourceData);
  // Build scene decks

  // Save
  return {
    update: {
      store: {},
      state: {
        phase: CRIMES_HEDIONDOS_PHASES.SETUP,
      },
    },
  };
};

export const prepareCrimeSelectionPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  // Assign groups of weapon and evidence to each player

  // Set starting scene tiles

  return {
    update: {
      state: {
        phase: CRIMES_HEDIONDOS_PHASES.CRIME_SELECTION,
      },
      players: players,
    },
  };
};

export const prepareSceneMarkingPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  // Assign groups of weapon and evidence to each player

  // Set starting scene tiles

  return {
    update: {
      store: {},
      state: {
        phase: CRIMES_HEDIONDOS_PHASES.SCENE_MARKING,
      },
      players: players,
    },
  };
};

export const prepareGuessingPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  // Assign groups of weapon and evidence to each player

  // Set starting scene tiles

  return {
    update: {
      state: {
        phase: CRIMES_HEDIONDOS_PHASES.GUESSING,
      },
      players: players,
    },
  };
};

export const prepareRevealPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  // Assign groups of weapon and evidence to each player

  // Set starting scene tiles

  return {
    update: {
      state: {
        phase: CRIMES_HEDIONDOS_PHASES.REVEAL,
      },
      players: players,
    },
  };
};

export const prepareGameOverPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  const winners = utils.determineWinners(players);

  return {
    update: {
      meta: {
        isComplete: true,
      },
    },
    set: {
      players,
      state: {
        phase: CRIMES_HEDIONDOS_PHASES.GAME_OVER,
        round: state.round,
        gameEndedAt: Date.now(),
        winners,
      },
    },
  };
};
