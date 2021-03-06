// Types
import type { PlainObject, Players, SaveGamePayload } from '../../utils/types';
import type { FirebaseStateData, FirebaseStoreData, ResourceData, TestemunhaOcularEntry } from './types';
import type { TestimonyQuestionCard } from '../../utils/tdr';
// Constants
import { MAX_ROUNDS, QUESTION_COUNT, SUSPECT_COUNT, TESTEMUNHA_OCULAR_PHASES } from './constants';
// Helpers
import * as utils from '../../utils';
import { calculateScore, determineTurnOrder, getQuestionerId, getQuestions } from './helpers';

/**
 * Setup
 * Build the card deck
 * Resets previous changes to the store
 * @returns
 */
export const prepareSetupPhase = async (additionalData: ResourceData): Promise<SaveGamePayload> => {
  // Build suspects grid
  const suspects = utils.game.getRandomItems(additionalData.allSuspects, SUSPECT_COUNT);
  const perpetrator = utils.game.getRandomItem(suspects);

  const shuffledAvailableCards = utils.game.shuffle(Object.values(additionalData.allCards));

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
    },
    set: {
      state: {
        phase: TESTEMUNHA_OCULAR_PHASES.SETUP,
        round: {
          current: 0,
          total: MAX_ROUNDS,
        },
        suspects,
        perpetrator,
        groupScore: 0,
        history: [],
      },
    },
  };
};

export const prepareWitnessSelectionPhase = async (): Promise<SaveGamePayload> => {
  // Save
  return {
    update: {
      state: {
        phase: TESTEMUNHA_OCULAR_PHASES.WITNESS_SELECTION,
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
  const turnOrder =
    store.turnOrder.length > 0
      ? store.turnOrder
      : determineTurnOrder(players, additionalPayload?.witnessId ?? state.witnessId);

  // Determine questioner player
  const questionerIndex = store.questionerIndex + 1;
  const questionerId = getQuestionerId(turnOrder, questionerIndex);
  // Determine questions
  const questionIndex = store.questionIndex + 2;
  const questions = getQuestions(store.deck, questionIndex);

  // Calculate score and move eliminated suspects
  const previouslyEliminatedSuspects = [
    ...(state?.previouslyEliminatedSuspects ?? []),
    ...(state?.eliminatedSuspects ?? []),
  ];

  const eliminatedSuspects = state?.eliminatedSuspects ?? [];

  // Calculate score
  const groupScore = calculateScore(state.score ?? 0, state.round.current, eliminatedSuspects.length);

  // Add entry to store
  let testimonyEntry: TestemunhaOcularEntry | PlainObject = {};
  if (state.question) {
    testimonyEntry = {
      id: state.question.id,
      question: state.question.question,
      unfit: eliminatedSuspects,
      fit: state.suspects.filter((sId: string) => !eliminatedSuspects.includes(sId)),
    };
  }

  const pastQuestions = testimonyEntry?.id ? [...store.pastQuestions, testimonyEntry] : store.pastQuestions;

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
        round: utils.helpers.increaseRound(state.round),
        questionerId,
        questions,
        question: utils.firebase.deleteValue(),
        witnessId: additionalPayload?.witnessId ?? state.witnessId,
        testimony: utils.firebase.deleteValue(),
        eliminatedSuspects: utils.firebase.deleteValue(),
        previouslyEliminatedSuspects: previouslyEliminatedSuspects,
        groupScore,
      },
    },
  };
};

export const prepareQuestioningPhase = async (
  store: FirebaseStoreData,
  additionalPayload: PlainObject
): Promise<SaveGamePayload> => {
  const question = store.deck.find((card: TestimonyQuestionCard) => card.id === additionalPayload.questionId);

  // Save
  return {
    update: {
      state: {
        phase: TESTEMUNHA_OCULAR_PHASES.QUESTIONING,
        question,
        questions: utils.firebase.deleteValue(),
      },
    },
  };
};

export const prepareTrialPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  additionalPayload: PlainObject
): Promise<SaveGamePayload> => {
  const testimony = additionalPayload?.testimony ?? state.testimony;

  const history = [...state.history];
  history.push({
    ...state.question,
    answer: testimony,
  });

  // Save
  return {
    update: {
      state: {
        phase: TESTEMUNHA_OCULAR_PHASES.TRIAL,
        testimony: additionalPayload?.testimony ?? state.testimony,
        history,
      },
    },
  };
};

export const prepareGameOverPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  additionalPayload: PlainObject
): Promise<SaveGamePayload> => {
  // Save
  return {
    update: {
      meta: {
        isComplete: true,
      },
    },
    set: {
      state: {
        phase: TESTEMUNHA_OCULAR_PHASES.GAME_OVER,
        round: state.round,
        gameEndedAt: Date.now(),
        perpetrator: state.perpetrator,
        groupScore: state.groupScore,
        outcome: additionalPayload?.win ? 'WIN' : 'LOSE',
        history: state.history,
      },
    },
  };
};
