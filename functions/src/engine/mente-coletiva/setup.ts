// Types
import { Players, SaveGamePayload } from '../../utils/types';
import { FirebaseStateData, FirebaseStoreData, ResourceData } from './types';
// Constants
import {
  MENTE_COLETIVA_PHASES,
  PASTURE_GAME_OVER_THRESHOLD,
  QUESTIONS_PER_ROUND,
  SHORT_PASTURE_GAME_OVER_THRESHOLD,
} from './constants';
// Utils
import * as utils from '../../utils';
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
  additionalData: ResourceData
): Promise<SaveGamePayload> => {
  // Determine turn order
  const { gameOrder } = utils.helpers.buildGameOrder(players);

  // Build deck
  const deck = buildDeck(additionalData.allQuestions);

  // Add level to players
  utils.players.addPropertiesToPlayers(players, {
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
        gameOrder,
        pastureSize: store.options?.shortPasture
          ? SHORT_PASTURE_GAME_OVER_THRESHOLD
          : PASTURE_GAME_OVER_THRESHOLD,
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
  const activePlayerId = utils.players.getActivePlayer(store.gameOrder, state.round.current + 1);

  // Modify player
  utils.players.addPropertiesToPlayers(players, {
    score: 0,
    answers: [],
  });
  utils.players.unReadyPlayer(players, activePlayerId);

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
        round: utils.helpers.increaseRound(state.round),
        roundType: determineRoundType(store.gameOrder.length, state.round.current + 1),
        activePlayerId,
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
  utils.players.unReadyPlayers(players);

  const currentQuestion = store.deck.find((question) => question.id === store.questionId);

  // Save
  return {
    update: {
      state: {
        phase: MENTE_COLETIVA_PHASES.EVERYBODY_WRITES,
        currentQuestion,
        currentQuestions: utils.firebase.deleteValue(),
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

  const isGameOver = determineGameOver(players, store.options?.shortPasture);
  const shouldSave = isGameOver && !state?.usedSave;
  if (shouldSave) {
    recalculateLastPasture(pastureChange, state.pastureSize);
    updateLevelsForPlayers(players, pastureChange[2]);
  }

  // Save
  return {
    update: {
      state: {
        phase: MENTE_COLETIVA_PHASES.RESOLUTION,
        ranking,
        pastureChangeStr: JSON.stringify(pastureChange),
        usedSave: Boolean(state?.usedSave) || shouldSave,
        announceSave: shouldSave,
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
  const winners = Object.values(players).filter((player) => player.level < state.pastureSize);

  const losers = Object.values(players).filter((player) => player.level === state.pastureSize);

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
