// Types
import { TestimonyQuestionCard } from '../../types/tdr';
import type { FirebaseStateData, FirebaseStoreData, ResourceData, TestemunhaOcularEntry } from './types';
// Constants
import {
  HARD_MODE_EXTRA_SUSPECT_COUNT,
  MAX_ROUNDS,
  QUESTION_COUNT,
  SUSPECT_COUNT,
  TESTEMUNHA_OCULAR_PHASES,
} from './constants';
// Helpers
import utils from '../../utils';
import { calculateScore, determineTurnOrder, getQuestionerId, getQuestions } from './helpers';
import { GAME_NAMES } from '../../utils/constants';
import { saveData } from './data';
import { orderBy } from 'lodash';

/**
 * Setup
 * Build the card deck
 * Resets previous changes to the store
 * @returns
 */
export const prepareSetupPhase = async (
  store: FirebaseStoreData,
  additionalData: ResourceData
): Promise<SaveGamePayload> => {
  // Build suspects grid
  const isHarderGame = store.options?.harderGame ?? false;
  const suspects = orderBy(
    utils.game.getRandomItems(
      additionalData.allSuspects,
      SUSPECT_COUNT + (isHarderGame ? HARD_MODE_EXTRA_SUSPECT_COUNT : 0)
    ),
    [`name.${store.language}`],
    ['asc']
  );

  const perpetrator = utils.game.getRandomItem(suspects);

  const shuffledAvailableCards = utils.game.shuffle(additionalData.allCards);

  // Build deck
  const deck = utils.game.getRandomItems(shuffledAvailableCards, QUESTION_COUNT);

  // Save
  return {
    update: {
      store: {
        deck,
        questionIndex: -2,
        questionerIndex: -1,
        pastQuestions: [],
        turnOrder: [],
        gameOrder: [],
      },
      state: {
        phase: TESTEMUNHA_OCULAR_PHASES.SETUP,
        round: {
          current: 0,
          total: MAX_ROUNDS,
        },
        suspects,
        perpetrator,
        status: {
          questions: 0,
          totalTime: MAX_ROUNDS,
          suspects: suspects.length,
          released: 0,
          score: 0,
        },
        history: [],
      },
    },
  };
};

export const prepareWitnessSelectionPhase = async (players: Players): Promise<SaveGamePayload> => {
  utils.players.unReadyPlayers(players);

  // Save
  return {
    update: {
      state: {
        phase: TESTEMUNHA_OCULAR_PHASES.WITNESS_SELECTION,
        players,
      },
    },
  };
};

export const prepareQuestionSelectionPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
  additionalPayload: PlainObject
): Promise<SaveGamePayload> => {
  const witnessId = additionalPayload?.witnessId ?? state.witnessId;
  const turnOrder = store.turnOrder.length > 0 ? store.turnOrder : determineTurnOrder(players, witnessId);

  // Determine questioner player
  const questionerIndex = (store.questionerIndex ?? -1) + 1;
  const questionerId = getQuestionerId(turnOrder, questionerIndex);
  // Determine questions
  const questionIndex = (store.questionIndex ?? -2) + 2;
  const questions = getQuestions(store.deck, questionIndex);

  // Calculate score and move eliminated suspects
  const previouslyEliminatedSuspects = [
    ...(state?.previouslyEliminatedSuspects ?? []),
    ...(state?.eliminatedSuspects ?? []),
  ];

  const eliminatedSuspects = state?.eliminatedSuspects ?? [];

  // Calculate score
  const score = calculateScore(state.status.score ?? 0, state.round.current, eliminatedSuspects.length);

  // Add entry to store
  let testimonyEntry: TestemunhaOcularEntry | PlainObject = {};
  if (state.question) {
    testimonyEntry = {
      id: state.question.id,
      question: state.question.question,
      unfit: eliminatedSuspects,
    };
  }

  const pastQuestions = testimonyEntry?.id ? [...store.pastQuestions, testimonyEntry] : store.pastQuestions;

  utils.players.readyPlayers(players, questionerId);

  // Save
  return {
    update: {
      store: {
        turnOrder,
        gameOrder: turnOrder,
        questionerIndex,
        questionIndex,
        pastQuestions,
      },
      state: {
        phase: TESTEMUNHA_OCULAR_PHASES.QUESTION_SELECTION,
        players,
        round: utils.helpers.increaseRound(state.round),
        questionerId,
        questions,
        witnessId,
        previouslyEliminatedSuspects: previouslyEliminatedSuspects,
        status: {
          ...state.status,
          score,
          questions: state.status.questions + 1,
          released: previouslyEliminatedSuspects.length,
        },
      },
      stateCleanup: ['question', 'testimony', 'eliminatedSuspects'],
    },
  };
};

export const prepareQuestioningPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
  additionalPayload: PlainObject
): Promise<SaveGamePayload> => {
  const question = store.deck.find((card: TestimonyQuestionCard) => card.id === additionalPayload.questionId);

  utils.players.readyPlayers(players, state.witnessId);

  // Save
  return {
    update: {
      state: {
        phase: TESTEMUNHA_OCULAR_PHASES.QUESTIONING,
        players,
        question,
      },
      stateCleanup: ['questions'],
    },
  };
};

export const prepareTrialPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
  additionalPayload: PlainObject
): Promise<SaveGamePayload> => {
  const testimony = additionalPayload?.testimony ?? state.testimony;

  const history = [...state.history];
  history.push({
    ...state.question,
    statement: testimony,
  });

  utils.players.readyPlayers(players, state.questionerId);

  // Save
  return {
    update: {
      state: {
        phase: TESTEMUNHA_OCULAR_PHASES.TRIAL,
        players,
        testimony: additionalPayload?.testimony ?? state.testimony,
        history,
      },
    },
  };
};

export const prepareGameOverPhase = async (
  gameId: GameId,
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
  additionalPayload: PlainObject
): Promise<SaveGamePayload> => {
  await utils.firestore.markGameAsComplete(gameId);

  const winners = additionalPayload?.win ? utils.players.getListOfPlayers(players) : [];

  await utils.user.saveGameToUsers({
    gameName: GAME_NAMES.TESTEMUNHA_OCULAR,
    gameId,
    startedAt: store.createdAt,
    players,
    winners,
    achievements: [],
    language: store.language,
  });

  // Save Data (usedSuspects, usedQuestions, relationships)
  await saveData(store.pastQuestions);

  utils.players.cleanup(players, []);

  return {
    update: {
      storeCleanup: utils.firestore.cleanupStore(store, []),
    },
    set: {
      state: {
        phase: TESTEMUNHA_OCULAR_PHASES.GAME_OVER,
        round: state.round,
        players,
        gameEndedAt: Date.now(),
        perpetrator: state.perpetrator,
        status: state.status,
        outcome: additionalPayload?.win ? 'WIN' : 'LOSE',
        history: state.history,
      },
    },
  };
};
