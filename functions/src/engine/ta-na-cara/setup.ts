// Constants
import { MAX_ROUNDS, PLAYER_SUGGESTED_QUESTIONS_COUNT, TA_NA_CARA_PHASES } from './constants';
import { GAME_NAMES } from '../../utils/constants';
import { shuffle } from 'lodash';
// Types
import type { FirebaseStateData, FirebaseStoreData, ResourceData } from './types';
// Utils
import utils from '../../utils';
import type { TestimonyQuestionCardData } from '../../types/tdr';

/**
 * Setup
 * Resets previous changes to the store
 * @returns
 */
export const prepareSetupPhase = async (
  _store: FirebaseStoreData,
  _state: FirebaseStateData,
  players: Players,
  additionalData: ResourceData,
): Promise<SaveGamePayload> => {
  // Determine player order
  const { gameOrder: turnOrder } = utils.turnOrder.create(players);

  // Assign a random character to each player
  const charactersIds = shuffle(additionalData.characters);

  utils.players.addPropertiesToPlayers(players, { answers: [] });

  utils.players.getListOfPlayers(players).forEach((player, index) => {
    player.secretCharacterId = charactersIds[index].id;
    player.suggestedQuestions = [];
    player.answers = [];
    player.history = {};
  });

  const achievements = utils.achievements.setup(players, {
    true: 0,
    false: 0,
    customQuestions: 0,
    testimonyQuestions: 0,
    eliminations: [],
  });

  // Save
  return {
    update: {
      store: {
        questions: additionalData.questions,
        achievements,
      },
      state: {
        phase: TA_NA_CARA_PHASES.SETUP,
        players,
        round: {
          current: 0,
          total: MAX_ROUNDS,
        },
        turnOrder,
        characters: additionalData.characters,
        questionsHistory: [],
      },
    },
  };
};

/**
 * [Prompt Phase] - Active player selects the secret word
 * @param store - The Firebase store data
 * @param state - The Firebase state data
 * @param players - The players object
 */
export const preparePromptPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  const questions: TestimonyQuestionCardData[] = store.questions;
  const questionsHistory: TestimonyQuestionCardData[] = state.questionsHistory || [];

  const previousPlayerId = state.activePlayerId as UID | null;
  if (previousPlayerId && state.currentQuestion) {
    questionsHistory.push(state.currentQuestion);

    utils.players.getListOfPlayers(players).forEach((player) => {
      player.answers.push(player.currentAnswer || 0);
    });

    players[previousPlayerId].suggestedQuestions = [];
  }

  // Every round a player will be the asker
  const activePlayerId = utils.turnOrder.getNextPlayerId(state.turnOrder, state.activePlayerId);

  // Add questions until the active player has the required number of suggested questions
  while (players[activePlayerId].suggestedQuestions.length < PLAYER_SUGGESTED_QUESTIONS_COUNT) {
    const question = questions.pop();
    if (!question) break;
    players[activePlayerId].suggestedQuestions.push(question);
  }

  utils.players.readyPlayers(players, activePlayerId);
  utils.players.removePropertiesFromPlayers(players, ['currentAnswer']);

  // Save
  return {
    update: {
      store: {
        questions,
      },
      state: {
        phase: TA_NA_CARA_PHASES.PROMPT,
        players,
        activePlayerId,
        round: activePlayerId === state.turnOrder[0] ? utils.game.increaseRound(state.round) : state.round,
        questionsHistory,
      },
      stateCleanup: ['currentQuestion'],
    },
  };
};
/**
 * [Answering Phase] - Players answer questions about the secret word
 * @param _store - The Firebase store data
 * @param state - The Firebase state data
 * @param players - The players object
 */ export const prepareAnsweringPhase = async (
  _store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  const round: Round = state.round;
  const activePlayerId: UID = state.activePlayerId;
  const activePlayer = players[activePlayerId];

  let currentQuestion: TestimonyQuestionCardData | null = null;

  // Get question
  if (activePlayer.currentQuestion) {
    currentQuestion = {
      id: `${activePlayer.id}-${round.current}`,
      question: activePlayer.currentQuestion,
      answer: activePlayer.currentQuestion,
      level: 0,
    };
  } else {
    const question = activePlayer.suggestedQuestions.find(
      (q: TestimonyQuestionCardData) => q.id === activePlayer.currentQuestionId,
    );
    activePlayer.suggestedQuestions = activePlayer.suggestedQuestions.filter(
      (q: TestimonyQuestionCardData) => q.id !== activePlayer.currentQuestionId,
    );
    if (question) {
      currentQuestion = question;
    }
  }

  utils.players.removePropertiesFromPlayers(players, ['currentQuestion', 'currentAnswer']);

  // Unready players
  utils.players.unReadyPlayers(players);

  // Save
  return {
    update: {
      state: {
        phase: TA_NA_CARA_PHASES.ANSWERING,
        players,
        currentQuestion,
      },
    },
  };
};
/**
 * [Guessing Phase] - Players guess the secret word
 * @param _store - The Firebase store data
 * @param state - The Firebase state data
 * @param players - The players object
 */ export const prepareGuessingPhase = async (
  _store: FirebaseStoreData,
  _state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  // Unready players
  utils.players.unReadyPlayers(players);

  // Save
  return {
    update: {
      state: {
        phase: TA_NA_CARA_PHASES.GUESSING,
        players,
      },
      stateCleanup: ['currentQuestion'],
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
  // Award points if the player have guessed the other correctly
  const playersList = utils.players.getListOfPlayers(players);

  playersList.forEach((player) => {
    const opponent = playersList.find((p) => p.id !== player.id);

    if (player.guess === opponent?.secretCharacterId) {
      player.score += 1;
    }
  });

  const winners = utils.players.determineWinners(players);

  utils.players.removePropertiesFromPlayers(players, ['suggestedQuestions', 'currentQuestionId']);

  await utils.firestore.markGameAsComplete(gameId);

  await utils.user.saveGameToUsers({
    gameName: GAME_NAMES.TA_NA_CARA,
    gameId,
    startedAt: store.createdAt,
    players,
    winners,
    achievements: [],
    language: store.language,
  });

  utils.players.unReadyPlayers(players);

  return {
    set: {
      state: {
        phase: TA_NA_CARA_PHASES.GAME_OVER,
        players,
        round: state.round,
        gameEndedAt: Date.now(),
        winners,
        characters: state.characters,
        questionsHistory: state.questionsHistory,
      },
    },
  };
};
