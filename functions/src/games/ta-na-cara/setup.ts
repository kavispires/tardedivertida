import { shuffle } from 'lodash';
// Types
import type { TestimonyStatementCardData } from '../../types/tdr';
import type { FirebaseStateData, FirebaseStoreData, ResourceData } from './types';
// Constants
import { GAME_NAMES } from '../../constants/games';
import { MAX_ROUNDS, PLAYER_SUGGESTED_QUESTIONS_COUNT, TA_NA_CARA_PHASES } from './constants';
// Services
import { cleanupStore, markGameAsComplete } from '../../services/game-session';
import { saveGameToUsers } from '../../services/user';
// Mechanics
import {
  removePropertiesFromPlayers,
  setPlayersReadyState,
  getListOfPlayers,
  addPropertiesToPlayers,
} from '../../mechanics/players';
import { increaseRound } from '../../mechanics/round';
import { determineWinners } from '../../mechanics/scoring';
import { turnOrderUtils } from '../../mechanics/turn-order';

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
  const { gameOrder: turnOrder } = turnOrderUtils.create(players);

  // Assign a random character to each player
  const charactersIds = shuffle(additionalData.characters);

  addPropertiesToPlayers(players, { answers: [] });

  getListOfPlayers(players).forEach((player, index) => {
    player.secretCharacterId = charactersIds[index].id;
    player.suggestedQuestions = [];
    player.answers = [];
    player.history = {};
  });

  // TODO: Implement achievements
  const achievements = {};

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
  const questions: TestimonyStatementCardData[] = store.questions;
  const questionsHistory: TestimonyStatementCardData[] = state.questionsHistory || [];

  const previousPlayerId = state.activePlayerId as UID | null;
  if (previousPlayerId && state.currentQuestion) {
    questionsHistory.push(state.currentQuestion);

    getListOfPlayers(players).forEach((player) => {
      player.answers.push(player.currentAnswer || 0);
    });

    players[previousPlayerId].suggestedQuestions = [];
  }

  // Every round a player will be the asker
  const activePlayerId = turnOrderUtils.getNextPlayerId(state.turnOrder, state.activePlayerId);

  // Add questions until the active player has the required number of suggested questions
  while (players[activePlayerId].suggestedQuestions.length < PLAYER_SUGGESTED_QUESTIONS_COUNT) {
    const question = questions.pop();
    if (!question) break;
    players[activePlayerId].suggestedQuestions.push(question);
  }

  setPlayersReadyState(players, true, { excludeIds: [activePlayerId] });
  removePropertiesFromPlayers(players, ['currentAnswer']);

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
        round: activePlayerId === state.turnOrder[0] ? increaseRound(state.round) : state.round,
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

  let currentQuestion: TestimonyStatementCardData | null = null;

  const activePlayerCurrentQuestion: string | undefined = activePlayer.currentQuestion;

  // Get question
  if (activePlayerCurrentQuestion) {
    currentQuestion = {
      id: `${activePlayer.id}-${round.current}`,
      statement: activePlayerCurrentQuestion,
      deck: 'default',
      level: 0,
    };
  } else {
    const question = activePlayer.suggestedQuestions.find(
      (q: TestimonyStatementCardData) => q.id === activePlayer.currentQuestionId,
    );
    activePlayer.suggestedQuestions = activePlayer.suggestedQuestions.filter(
      (q: TestimonyStatementCardData) => q.id !== activePlayer.currentQuestionId,
    );
    if (question) {
      currentQuestion = question;
    }
  }

  removePropertiesFromPlayers(players, ['currentQuestion', 'currentAnswer']);

  // Unready players
  setPlayersReadyState(players, false);

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
  setPlayersReadyState(players, false);

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
  const playersList = getListOfPlayers(players);

  playersList.forEach((player) => {
    const opponent = playersList.find((p) => p.id !== player.id);

    if (player.guess === opponent?.secretCharacterId) {
      player.score += 1;
    }
  });

  const winners = determineWinners(players);

  removePropertiesFromPlayers(players, ['suggestedQuestions', 'currentQuestionId']);

  await markGameAsComplete(gameId);

  await saveGameToUsers({
    gameName: GAME_NAMES.TA_NA_CARA,
    gameId,
    startedAt: store.createdAt,
    players,
    winners,
    achievements: [],
    language: store.language,
  });

  setPlayersReadyState(players, false);

  return {
    update: {
      store: cleanupStore(store, []),
    },
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
