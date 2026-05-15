// Constants
import { CRIMES_HEDIONDOS_PHASES } from './constants';
import { GAME_NAMES } from '../../utils/constants';
// Types
import type { FirebaseStateData, FirebaseStoreData, ResourceData } from './types';
// Utils
import utils from '../../utils';
// Internal
import {
  buildCrimes,
  buildRanking,
  buildScenes,
  cleanupItemsLikelihood,
  dealItemGroups,
  getAchievements,
  groupItems,
  mockCrimeForBots,
  mockGuessingForBots,
  mockSceneMarkForBots,
  parseTiles,
  updateCrime,
  updateOrCreateGuessHistory,
} from './helpers';

/**
 * Setup phase - initializes game state and resources
 * @param _store - The Firebase store data
 * @param _state - The Firebase state data
 * @param players - The players object
 * @param resourceData - Resource data
 */
export const prepareSetupPhase = async (
  _store: FirebaseStoreData,
  _state: FirebaseStateData,
  players: Players,
  resourceData: ResourceData,
): Promise<SaveGamePayload> => {
  // Build scene decks
  const { causeOfDeathTile, reasonForEvidenceTile, locationTile, victimTile, sceneTiles } = parseTiles(
    resourceData.allScenes,
  );

  const achievements = utils.achievements.setup(players, {
    wrongGroups: 0,
    wrong: 0,
    one: 0,
    two: 0,
    three: 0,
    four: 0,
    correct: [],
    weapons: [],
    evidence: [],
    victims: [],
    locations: [],
  });

  // Cleanup unused scene tiles from items likelihood object
  const sceneTilesIds = [
    ...sceneTiles.map((scene) => scene.id),
    causeOfDeathTile?.id,
    reasonForEvidenceTile?.id,
    locationTile?.id,
    victimTile?.id,
  ].filter(Boolean) as string[];

  cleanupItemsLikelihood(
    resourceData.weapons,
    resourceData.evidence,
    resourceData.victims ?? [],
    resourceData.locations ?? [],
    sceneTilesIds,
  );

  // Save
  return {
    update: {
      store: {
        scenes: sceneTiles,
        weapons: resourceData.weapons,
        evidence: resourceData.evidence,
        locations: resourceData.locations,
        victims: resourceData.victims,
        achievements,
      },
      state: {
        phase: CRIMES_HEDIONDOS_PHASES.SETUP,
        players,
        causeOfDeathTile,
        reasonForEvidenceTile,
        locationTile,
        victimTile,
      },
    },
  };
};

/**
 * Crime Selection phase - players select which crime scene to investigate
 * @param store - The Firebase store data
 * @param state - The Firebase state data
 * @param players - The players object
 */
export const prepareCrimeSelectionPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  // Group weapons
  const { groupedItems, items } = groupItems(store.weapons, store.evidence, store.victims, store.locations);

  // Assign groups of weapon and evidence to each player
  dealItemGroups(players);

  // Unready players
  utils.players.unReadyPlayers(players);
  utils.players.addPropertiesToPlayers(players, { secretScore: 0, pastCorrectCrimes: 0, history: {} });

  // Auto select cards for bots and perform initial markings
  mockCrimeForBots(
    players,
    groupedItems,
    items,
    state.causeOfDeathTile,
    state.reasonForEvidenceTile,
    state.locationTile,
    state.victimTile,
  );

  return {
    update: {
      state: {
        phase: CRIMES_HEDIONDOS_PHASES.CRIME_SELECTION,
        round: utils.game.increaseRound(state.round),
        players,
        items,
        groupedItems,
      },
    },
  };
};

/**
 * Scene Marking phase - players mark evidence on the crime scene
 * @param store - The Firebase store data
 * @param state - The Firebase state data
 * @param players - The players object
 */
export const prepareSceneMarkingPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  // Set new scene to scenes
  const newScene = store.scenes.pop();
  const updatedScenes = {
    ...state.scenes,
    [newScene.id]: newScene,
  };
  const updatedScenesOrder = [...state.scenesOrder, newScene.id];

  // Perform markings for bots
  mockSceneMarkForBots(players, newScene, state.items);

  // Unready players
  utils.players.unReadyPlayers(players);
  // Update pastCorrectCrimes
  utils.players.getListOfPlayers(players).forEach((player) => {
    player.pastCorrectCrimes += player.correctCrimes ?? 0;
  });

  return {
    update: {
      store: {
        scenes: store.scenes,
      },
      state: {
        phase: CRIMES_HEDIONDOS_PHASES.SCENE_MARKING,
        round: utils.game.increaseRound(state.round),
        players: players,
        scenes: updatedScenes,
        scenesOrder: updatedScenesOrder,
        currentScene: newScene,
      },
      stateCleanup: ['results', 'winners', 'ranking'],
    },
  };
};

/**
 * Guessing phase - players attempt to solve the crime
 * @param store - The Firebase store data
 * @param state - The Firebase state data
 * @param players - The players object
 */
export const prepareGuessingPhase = async (
  _store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  // Unready players
  utils.players.unReadyPlayers(players);

  if (state.round.current === 1) {
    // Group scenes
    const { scenes, order } = buildScenes(
      state.causeOfDeathTile,
      state.reasonForEvidenceTile,
      state.victimTile,
      state.locationTile,
    );
    // Gather answers and build crimes
    const crimes = buildCrimes(
      players,
      state.causeOfDeathTile,
      state.reasonForEvidenceTile,
      state.locationTile,
      state.victimTile,
    );
    // Cleanup properties from players
    utils.players.removePropertiesFromPlayers(players, [
      'causeOfDeathIndex',
      'locationIndex',
      'reasonForEvidenceIndex',
      'victimIndex',
    ]);

    mockGuessingForBots(players);

    return {
      update: {
        state: {
          phase: CRIMES_HEDIONDOS_PHASES.GUESSING,
          players,
          crimes,
          scenes,
          scenesOrder: order,
        },
        stateCleanup: ['causeOfDeathTile', 'reasonForEvidenceTile', 'locationTile', 'victimTile'],
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
        players,
        crimes: updatedCrimes,
      },
      stateCleanup: ['currentScene'],
    },
  };
};

/**
 * Reveal phase - reveals the solution and evaluates guesses
 * @param store - The Firebase store data
 * @param state - The Firebase state data
 * @param players - The players object
 */
export const prepareRevealPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  // Unready players
  utils.players.unReadyPlayers(players);

  // Update or create guess history
  const results = updateOrCreateGuessHistory(
    state.crimes,
    players,
    state.groupedItems,
    store,
    state.round.current,
  );

  // Reveal stuff
  const { ranking, winners } = buildRanking(players, state.round.current);

  return {
    update: {
      state: {
        phase: CRIMES_HEDIONDOS_PHASES.REVEAL,
        players,
        ranking,
        winners,
        results,
        round: {
          ...state.round,
          forceLastRound: state?.round.forceLastRound || winners.length > 0,
        },
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
  // Unready players
  utils.players.unReadyPlayers(players);

  // Check if anybody has won, if so, from those, get the highest score, otherwise, any higher score
  const winningPlayers = state.winners.map((playerId: UID) => players[playerId]);

  const winners = utils.players.determineWinners(
    Object.keys(winningPlayers).length > 0 ? winningPlayers : players,
  );

  const achievements = getAchievements(store);

  await utils.firestore.markGameAsComplete(gameId);

  await utils.user.saveGameToUsers({
    gameName: GAME_NAMES.CRIMES_HEDIONDOS,
    gameId,
    startedAt: store.createdAt,
    players,
    winners,
    achievements,
    language: store.language,
  });

  // TODO: Save data

  return {
    set: {
      state: {
        phase: CRIMES_HEDIONDOS_PHASES.GAME_OVER,
        players,
        round: state.round,
        gameEndedAt: Date.now(),
        winners,
        achievements,
        scenes: state.scenes,
        scenesOrder: state.scenesOrder,
        items: state.items,
        groupedItems: state.groupedItems,
        crimes: state.crimes,
      },
    },
  };
};
