// Constants
import { CARDS_PER_GAME, CRIMES_HEDIONDOS_PHASES } from './constants';
// Types
import { FirebaseStateData, FirebaseStoreData, ResourceData } from './types';
import { Players, SaveGamePayload } from '../../utils/types';
// Utils
import * as utils from '../../utils/helpers';
import * as gameUtils from '../../utils/game-utils';
import { dealItemGroups, groupItems, parseTiles } from './helpers';
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
  const weapons = gameUtils.getRandomItems(resourceData.allWeapons, CARDS_PER_GAME);
  const evidence = gameUtils.getRandomItems(resourceData.allEvidence, CARDS_PER_GAME);

  // Build scene decks
  const { causeOfDeathTile, reasonForEvidenceTile, locationTiles, sceneTiles } = parseTiles(
    resourceData.allScenes
  );

  // Save
  return {
    update: {
      store: {
        scenes: sceneTiles,
        weapons,
        evidence,
      },
      state: {
        phase: CRIMES_HEDIONDOS_PHASES.SETUP,
        causeOfDeathTile,
        reasonForEvidenceTile,
        locationTiles,
      },
    },
  };
};

export const prepareCrimeSelectionPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  // Group weapons
  const { groupedItems, items } = groupItems(store.weapons, store.evidence);

  // Assign groups of weapon and evidence to each player
  dealItemGroups(players);

  // Unready players
  utils.unReadyPlayers(players);

  return {
    update: {
      state: {
        phase: CRIMES_HEDIONDOS_PHASES.CRIME_SELECTION,
        round: utils.increaseRound(state.round),
        items,
        groupedItems,
      },
      players,
    },
  };
};

export const prepareSceneMarkingPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  // Set  new scene scene tiles

  return {
    update: {
      store: {},
      state: {
        phase: CRIMES_HEDIONDOS_PHASES.SCENE_MARKING,
        round: utils.increaseRound(state.round),
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
  // Gather responses

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
  // Reveal stuff

  // Make ranking

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
