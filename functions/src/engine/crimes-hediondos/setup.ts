// Constants
import { CARDS_PER_GAME, CRIMES_HEDIONDOS_PHASES } from './constants';
// Types
import type { FirebaseStateData, FirebaseStoreData, ResourceData } from './types';
// Utils
import * as utils from '../../utils';
// Internal
import {
  buildCrimes,
  buildRanking,
  buildScenes,
  dealItemGroups,
  groupItems,
  mockCrimeForBots,
  mockGuessingForBots,
  mockSceneMarkForBots,
  parseTiles,
  updateCrime,
  updateOrCreateGuessHistory,
} from './helpers';

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
  const weapons = utils.game.getRandomItems(resourceData.allWeapons, CARDS_PER_GAME);
  const evidence = utils.game.getRandomItems(resourceData.allEvidence, CARDS_PER_GAME);

  // Build scene decks
  const { causeOfDeathTile, reasonForEvidenceTile, locationTiles, sceneTiles } = parseTiles(
    resourceData.allScenes
  );

  // Helper Bots
  if (store.options.withBots) {
    utils.players.addBots(players, 2);
  }

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
  utils.players.unReadyPlayers(players);
  utils.players.addPropertiesToPlayers(players, { secretScore: 0, pastCorrectCrimes: 0, history: {} });

  // Auto select cards for bots and perform initial markings
  mockCrimeForBots(players, groupedItems);

  return {
    update: {
      state: {
        phase: CRIMES_HEDIONDOS_PHASES.CRIME_SELECTION,
        round: utils.helpers.increaseRound(state.round),
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

  // Perform markings for bots
  mockSceneMarkForBots(players);

  // Unready players
  utils.players.unReadyPlayers(players);
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
        round: utils.helpers.increaseRound(state.round),
        scenes: updatedScenes,
        scenesOrder: updatedScenesOrder,
        currentScene: newScene,
        results: utils.firebase.deleteValue(),
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
  utils.players.unReadyPlayers(players);

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
    utils.players.removePropertiesFromPlayers(players, [
      'causeOfDeath',
      'locationIndex',
      'locationTile',
      'reasonForEvidence',
    ]);

    mockGuessingForBots(players);

    return {
      update: {
        state: {
          phase: CRIMES_HEDIONDOS_PHASES.GUESSING,
          crimes,
          scenes,
          scenesOrder: order,
          causeOfDeathTile: utils.firebase.deleteValue(),
          reasonForEvidenceTile: utils.firebase.deleteValue(),
          locationTiles: utils.firebase.deleteValue(),
        },
        players,
      },
    };
  }

  // If any other round, add new scene to crimes
  const updatedCrimes = updateCrime(state.crimes, players, state.currentScene);

  // Cleanup properties from players
  utils.players.removePropertiesFromPlayers(players, ['sceneIndex']);

  return {
    update: {
      state: {
        phase: CRIMES_HEDIONDOS_PHASES.GUESSING,
        crimes: updatedCrimes,
        currentScene: utils.firebase.deleteValue(),
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
  const results = updateOrCreateGuessHistory(state.crimes, players, state.groupedItems);

  // Reveal stuff
  const { ranking, winners } = buildRanking(players, state.round.current);

  return {
    update: {
      state: {
        phase: CRIMES_HEDIONDOS_PHASES.REVEAL,
        ranking,
        winners,
        results,
        lastRound: state?.lastRound || winners.length > 0 ? true : utils.firebase.deleteValue(),
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

  const winningPlayers = state.winners.map((playerId: PlayerId) => players[playerId]);

  const winners = utils.players.determineWinners(
    Object.keys(winningPlayers).length > 0 ? winningPlayers : players
  );

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
