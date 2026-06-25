import { cloneDeep, orderBy, sampleSize, shuffle } from 'lodash';
// Types
import type { DrawingEntryData, FirebaseStateData, FirebaseStoreData, ResourceData } from './types';
// Constants
import { GAME_NAMES } from '../../constants/games';
import {
  LONGER_TIME_LIMIT,
  NORMAL_TIME_LIMIT,
  SINAIS_DE_ALERTA_PHASES,
  TABLE_CARDS,
  TOTAL_ROUNDS,
} from './constants';
// Services
import { cleanupStore, markGameAsComplete } from '../../services/game-session';
// Utils
import utils from '../../utils_LEGACY';
// Internal
import { setupAchievements, calculateAchievements } from './achievements';
import { saveDrawings } from './data';
import { dealCardsToPlayers, evaluateAnswers } from './helpers';

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
  // Get number of cards per level
  const playerCount = utils.players.getPlayerCount(players);

  // Gather topics and letters for the entire game 5x4 grid
  const { allSubjects, allDescriptors } = resourceData;

  const cardsNeeded = (playerCount + TABLE_CARDS) * TOTAL_ROUNDS;
  const subjectsDeck = sampleSize(allSubjects, cardsNeeded);
  const descriptorsDeck = sampleSize(allDescriptors, cardsNeeded);

  const achievements = setupAchievements(utils.players.getListOfPlayersIds(players));

  // Save
  return {
    update: {
      store: {
        achievements,
        subjectsDeck,
        descriptorsDeck,
        pastDrawings: [],
      },
      state: {
        phase: SINAIS_DE_ALERTA_PHASES.SETUP,
        timeLimit: store?.options?.longerTimer ? LONGER_TIME_LIMIT : NORMAL_TIME_LIMIT,
      },
    },
  };
};

/**
 * [Drawing Phase] - Players draw based on their assigned cards
 * @param store - The Firebase store data
 * @param state - The Firebase state data
 * @param players - The players object
 */
export const prepareDrawingPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  // Unready players
  utils.players.unReadyPlayers(players);

  // Remove previous 'guesses' from players
  utils.players.removePropertiesFromPlayers(players, ['guesses']);
  utils.players.addPropertiesToPlayers(players, {
    currentSubjectId: '',
    currentDescriptorId: '',
    drawing: '',
  });

  // Deals cards to players and table, returning a dictionary of cards
  const cards = dealCardsToPlayers(players, store);

  return {
    update: {
      store: {
        ...store,
      },
      state: {
        phase: SINAIS_DE_ALERTA_PHASES.DRAWING,
        round: utils.game.increaseRound(state.round),
        timeLimit: store?.options?.longerTimer ? LONGER_TIME_LIMIT : NORMAL_TIME_LIMIT,
        cards,
        players,
      },
      stateCleanup: ['subjectsIds', 'descriptorsIds', 'drawings', 'gallery', 'ranking'],
    },
  };
};

/**
 * [Evaluation Phase] - Players guess the subject and descriptor of drawings
 * @param _store - The Firebase store data
 * @param state - The Firebase state data
 * @param players - The players object
 */
export const prepareEvaluationPhase = async (
  _store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  // Unready players
  utils.players.unReadyPlayers(players);

  // Gather all drawings
  const drawings = utils.players.getListOfPlayers(players).map((player) => {
    const entry: DrawingEntryData = {
      playerId: player.id,
      subjectId: player.currentSubjectId,
      descriptorId: player.currentDescriptorId,
      drawing: player.currentDrawing,
    };
    return entry;
  });

  const subjectsIds = shuffle(Object.keys(state.cards).filter((id) => id.includes('wss')));
  const descriptorsIds = shuffle(Object.keys(state.cards).filter((id) => id.includes('wsd')));

  utils.players.removePropertiesFromPlayers(players, ['choseRandomly']);

  return {
    update: {
      state: {
        phase: SINAIS_DE_ALERTA_PHASES.EVALUATION,
        players,
        subjectsIds,
        descriptorsIds,
        drawings,
      },
    },
  };
};

/**
 * [Gallery Phase] - Display all drawings and their evaluations
 * @param store - The Firebase store data
 * @param state - The Firebase state data
 * @param players - The players object
 */
export const prepareGalleryPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  // Unready players
  utils.players.unReadyPlayers(players);

  // Build gallery and ranking
  const { gallery, pastDrawings, ranking } = evaluateAnswers(state.drawings, players, state.cards, store);

  return {
    update: {
      store: {
        pastDrawings: [...store.pastDrawings, ...pastDrawings],
        achievements: store.achievements,
      },
      state: {
        phase: SINAIS_DE_ALERTA_PHASES.GALLERY,
        players,
        gallery,
        ranking,
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
  const winners = utils.players.determineWinners(players);

  const finalGallery = orderBy(cloneDeep(store.pastDrawings), 'accuracy', 'desc');

  const achievements = calculateAchievements(store.achievements);

  await markGameAsComplete(gameId);

  await utils.user.saveGameToUsers({
    gameName: GAME_NAMES.SINAIS_DE_ALERTA,
    gameId,
    startedAt: store.createdAt,
    players,
    winners,
    achievements,
    language: store.language,
  });

  // Save data (drawings)
  await saveDrawings(store.pastDrawings, store.language);

  utils.players.cleanup(players, []);

  return {
    update: {
      storeCleanup: cleanupStore(store, []),
    },
    set: {
      state: {
        phase: SINAIS_DE_ALERTA_PHASES.GAME_OVER,
        round: state.round,
        gameEndedAt: Date.now(),
        players,
        winners,
        gallery: orderBy(finalGallery, 'accuracy', 'desc'),
        achievements,
      },
    },
  };
};
