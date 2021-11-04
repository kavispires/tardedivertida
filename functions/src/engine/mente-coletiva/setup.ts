// Interfaces
import { PlainObject, Players, SaveGamePayload } from '../../utils/interfaces';
import { FirebaseStateData, FirebaseStoreData } from './interfaces';
// Constants
import { MAX_ROUNDS, MENTE_COLETIVA_PHASES, QUESTIONS_PER_ROUND } from './constants';
// Utils
import * as gameUtils from '../../utils/game-utils';
import * as firebaseUtils from '../../utils/firebase';
import * as utils from '../../utils/helpers';
import {
  buildDeck,
  buildListOfAnswers,
  buildPastureChange,
  buildRanking,
  determineGameOver,
  determineHighestScores,
  determineLowestScores,
  determineRoundType,
  extendPlayerAnswers,
  updateLevelsForPlayers,
  gatherAllAnswers,
  recalculateLastPasture,
} from './helpers';

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
  const deck = buildDeck(additionalData.allQuestions, additionalData.usedQuestions);

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
          total: MAX_ROUNDS,
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
  // Determine active player based on current round
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
  // Modify players
  utils.unReadyPlayers(players);

  const currentQuestion = store.deck.find((question) => question.id === store.questionId);

  // Save
  return {
    update: {
      state: {
        phase: MENTE_COLETIVA_PHASES.EVERYBODY_WRITES,
        updatedAt: Date.now(),
        currentQuestion,
        currentQuestions: firebaseUtils.deleteValue(),
      },
      store: {
        pastQuestions: [...store.pastQuestions, currentQuestion.id],
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
  const allAnswers = gatherAllAnswers(players);
  const answersList = buildListOfAnswers(allAnswers);

  // Transform player answers into objects
  extendPlayerAnswers(players);

  // Save
  return {
    update: {
      state: {
        phase: MENTE_COLETIVA_PHASES.COMPARE,
        updatedAt: Date.now(),
        answersList,
        allAnswers,
      },
      players,
    },
  };
};

export const prepareResolutionPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  // Add up score
  Object.values(players).forEach((player) => {
    Object.values(player.answers).forEach((playerAnswer: any) => {
      player.score += playerAnswer.score;
    });
  });

  // Determine ranking
  const ranking = buildRanking(players);

  const lowestScores = determineLowestScores(ranking, state.roundType);

  const highestScores = determineHighestScores(ranking, state.roundType);

  const pastureChange = buildPastureChange(players, lowestScores, highestScores);

  // Fixed up level based on pastureChange
  updateLevelsForPlayers(players, pastureChange[2]);

  const isGameOver = determineGameOver(players);
  if (isGameOver && !state?.usedSave) {
    recalculateLastPasture(pastureChange);
    updateLevelsForPlayers(players, pastureChange[2]);
  }

  // Save
  return {
    update: {
      state: {
        phase: MENTE_COLETIVA_PHASES.RESOLUTION,
        updatedAt: Date.now(),
        ranking,
        pastureChangeStr: JSON.stringify(pastureChange),
        usedSave: state?.usedSave || (isGameOver && !state?.usedSave),
        announceSave: isGameOver && !state?.usedSave,
      },
      players,
    },
  };
};

export const prepareGameOverPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  const winners = Object.values(players).filter((player) => player.level < 5);

  const losers = Object.values(players).filter((player) => player.level === 5);

  // Save
  return {
    set: {
      state: {
        phase: MENTE_COLETIVA_PHASES.GAME_OVER,
        gameEndedAt: Date.now(),
        round: state.round,
        winners,
        losers,
      },
    },
  };
};
