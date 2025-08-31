// Constants
import {
  LONGER_TIME_LIMIT,
  NORMAL_TIME_LIMIT,
  SINAIS_DE_ALERTA_PHASES,
  TABLE_CARDS,
  TOTAL_ROUNDS,
} from './constants';
import { GAME_NAMES } from '../../utils/constants';
// Types
import type { DrawingEntry, FirebaseStateData, FirebaseStoreData, ResourceData } from './types';
// Utils
import utils from '../../utils';
import { dealCardsToPlayers, evaluateAnswers, getAchievements } from './helpers';
import { saveDrawings } from './data';
import { cloneDeep, orderBy } from 'lodash';

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
  const subjectsDeck = utils.game.getRandomItems(allSubjects, cardsNeeded);
  const descriptorsDeck = utils.game.getRandomItems(allDescriptors, cardsNeeded);

  const achievements = utils.achievements.setup(players, {
    subjectGuesses: 0,
    descriptorGuesses: 0,
    subjectDrawings: 0,
    descriptorDrawings: 0,
    chooseForMe: 0,
    // TODO: add table votes
    // tableVotes: 0,
  });

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
        round: utils.helpers.increaseRound(state.round),
        timeLimit: store?.options?.longerTimer ? LONGER_TIME_LIMIT : NORMAL_TIME_LIMIT,
        cards,
        players,
      },
      stateCleanup: ['subjectsIds', 'descriptorsIds', 'drawings', 'gallery', 'ranking'],
    },
  };
};

export const prepareEvaluationPhase = async (
  _store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  // Unready players
  utils.players.unReadyPlayers(players);

  // Gather all drawings
  const drawings = utils.players.getListOfPlayers(players).map((player) => {
    const entry: DrawingEntry = {
      playerId: player.id,
      subjectId: player.currentSubjectId,
      descriptorId: player.currentDescriptorId,
      drawing: player.currentDrawing,
    };
    return entry;
  });

  const subjectsIds = utils.game.shuffle(Object.keys(state.cards).filter((id) => id.includes('wss')));
  const descriptorsIds = utils.game.shuffle(Object.keys(state.cards).filter((id) => id.includes('wsd')));

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

export const prepareGameOverPhase = async (
  gameId: GameId,
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  const winners = utils.players.determineWinners(players);

  const finalGallery = orderBy(cloneDeep(store.pastDrawings), 'accuracy', 'desc');

  const achievements = getAchievements(store);

  await utils.firestore.markGameAsComplete(gameId);

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
      storeCleanup: utils.firestore.cleanupStore(store, []),
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
