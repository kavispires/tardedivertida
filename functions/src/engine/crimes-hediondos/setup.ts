// Constants
import { CARDS_PER_GAME, CRIMES_HEDIONDOS_PHASES } from './constants';
// Types
import { FirebaseStateData, FirebaseStoreData, ResourceData } from './types';
import { Players, SaveGamePayload } from '../../utils/types';
// Utils
import * as utils from '../../utils/helpers';
import * as gameUtils from '../../utils/game-utils';
import * as firebaseUtils from '../../utils/firebase';

import {
  buildCrimes,
  buildRanking,
  buildScenes,
  dealItemGroups,
  groupItems,
  parseTiles,
  updateCrime,
  updateOrCreateGuessHistory,
} from './helpers';
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
  utils.addPropertiesToPlayers(players, { secretScore: 0, pastCorrectCrimes: 0, history: {} });

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
  // Set new scene to scenes
  const newScene = store.scenes.pop();
  const updatedScenes = {
    ...state.scenes,
    [newScene.id]: newScene,
  };
  const updatedScenesOrder = [...state.scenesOrder, newScene.id];

  // Unready players
  utils.unReadyPlayers(players);
  // Update pastCorrectCrimes
  Object.values(players).forEach((player) => {
    player.pastCorrectCrimes += player.correctCrimes ?? 0;
  });

  return {
    update: {
      store: {
        scenes: store.scenes,
      },
      state: {
        phase: CRIMES_HEDIONDOS_PHASES.SCENE_MARKING,
        round: utils.increaseRound(state.round),
        scenes: updatedScenes,
        scenesOrder: updatedScenesOrder,
        currentScene: newScene,
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
  // Unready players
  utils.unReadyPlayers(players);

  if (state.round.current === 1) {
    // Group scenes
    const { scenes, order } = buildScenes(
      state.causeOfDeathTile,
      state.reasonForEvidenceTile,
      state.locationTiles,
      players
    );
    // Gather answers and build crimes
    const crimes = buildCrimes(players, state.causeOfDeathTile, state.reasonForEvidenceTile);
    // Cleanup properties from players
    utils.removePropertiesFromPlayers(players, [
      'causeOfDeath',
      'locationIndex',
      'locationTile',
      'reasonForEvidence',
    ]);

    return {
      update: {
        state: {
          phase: CRIMES_HEDIONDOS_PHASES.GUESSING,
          crimes,
          scenes,
          scenesOrder: order,
          causeOfDeathTile: firebaseUtils.deleteValue(),
          reasonForEvidenceTile: firebaseUtils.deleteValue(),
          locationTiles: firebaseUtils.deleteValue(),
        },
        players: players,
      },
    };
  }

  // If any other round, add new scene to crimes
  const updatedCrimes = updateCrime(state.crimes, players, state.currentScene);

  // Cleanup properties from players
  utils.removePropertiesFromPlayers(players, ['sceneIndex']);

  return {
    update: {
      state: {
        phase: CRIMES_HEDIONDOS_PHASES.GUESSING,
        crimes: updatedCrimes,
        currentScene: firebaseUtils.deleteValue(),
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
  // Update or create guess history
  updateOrCreateGuessHistory(state.crimes, players, state.groupedItems);

  // Reveal stuff
  const { ranking, winners } = buildRanking(players, state.round.current);

  return {
    update: {
      state: {
        phase: CRIMES_HEDIONDOS_PHASES.REVEAL,
        ranking,
        lastRound: winners.length > 0,
        winners,
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
  // Check if anybody has won, if so, from those, get the highest score, otherwise, any higher score

  const winningPlayers = state.winners.map((playerId) => players[playerId]);

  const winners = utils.determineWinners(Object.keys(winningPlayers).length > 0 ? winningPlayers : players);

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
        scenes: state.scenes,
        scenesOrder: state.scenesOrder,
        items: state.items,
        groupedItems: state.groupedItems,
        crimes: state.crimes,
      },
    },
  };
};
