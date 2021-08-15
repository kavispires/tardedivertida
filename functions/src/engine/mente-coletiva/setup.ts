// Interfaces
import { PlainObject, Players, SaveGamePayload } from '../../utils/interfaces';
import { FirebaseStateData, FirebaseStoreData } from './interfaces';
// Constants
import { MAX_NUMBER_OF_ROUNDS, MENTE_COLETIVA_PHASES, QUESTIONS_PER_ROUND } from './constants';
// Utils
import * as gameUtils from '../../utils/game-utils';
import * as firebaseUtils from '../../utils/firebase';
import * as utils from '../../utils/helpers';
import { buildDeck, determineRoundType } from './helpers';

/**
 * Setup
 * Build the card deck
 * Resets previous changes to the store
 * @returns
 */
export const prepareSetupPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
  additionalData: PlainObject
): Promise<SaveGamePayload> => {
  // Determine turn order
  const gameOrder = gameUtils.shuffle(Object.keys(players));

  // Build deck
  const deck = buildDeck(additionalData.allQuestions, additionalData.pastQuestions);

  // Add level to players
  utils.addPropertiesFromPlayers(players, {
    level: 0,
    answers: [],
  });

  // Save
  return {
    update: {
      store: {
        deck,
        gameOrder,
        pastQuestions: [],
        deckIndex: 0,
      },
      state: {
        phase: MENTE_COLETIVA_PHASES.SETUP,
        updatedAt: Date.now(),
        gameOrder,
        round: {
          current: 0,
          total: MAX_NUMBER_OF_ROUNDS,
        },
      },
      players,
    },
  };
};

export const prepareQuestionSelectionPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  // Determine turn order
  const activePlayer = utils.getActivePlayer(store.gameOrder, state.round.current + 1);

  // Modify player
  utils.addPropertiesFromPlayers(players, {
    score: 0,
    answers: [],
  });
  utils.unReadyPlayer(players, activePlayer);

  // Get questions
  const currentQuestions = Array(QUESTIONS_PER_ROUND)
    .fill(store.deckIndex)
    .map((deckIndex, index) => store.deck[deckIndex + index]);

  // Save
  return {
    update: {
      store: {
        deckIndex: store.deckIndex + QUESTIONS_PER_ROUND,
      },
      state: {
        phase: MENTE_COLETIVA_PHASES.QUESTION_SELECTION,
        updatedAt: Date.now(),
        round: utils.increaseRound(state.round),
        roundType: determineRoundType(store.gameOrder.length, state.round.current + 1),
        activePlayer,
        currentQuestions,
      },
      players,
    },
  };
};

export const prepareEverybodyWritesPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  // Modify player
  utils.unReadyPlayers(players);

  // Save
  return {
    update: {
      state: {
        phase: MENTE_COLETIVA_PHASES.EVERYBODY_WRITES,
        updatedAt: Date.now(),
        currentQuestion: store.currentQuestion,
        currentQuestions: firebaseUtils.deleteValue(),
      },
      players,
    },
  };
};

export const prepareComparePhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  console.log(Object.keys(players));

  // Save
  return {
    update: {
      state: {
        phase: MENTE_COLETIVA_PHASES.COMPARE,
        updatedAt: Date.now(),
        answers: [],
      },
    },
  };
};

export const prepareResolutionPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  console.log(Object.keys(players));

  // Save
  return {
    update: {
      state: {
        phase: MENTE_COLETIVA_PHASES.RESOLUTION,
        updatedAt: Date.now(),
        answers: [],
      },
    },
  };
};

export const prepareGameOverPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  console.log(Object.keys(players));

  // Save
  return {
    update: {
      state: {
        phase: MENTE_COLETIVA_PHASES.GAME_OVER,
        updatedAt: Date.now(),
        answers: [],
      },
    },
  };
};
