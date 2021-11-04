// Interfaces
import * as firebaseUtils from '../../utils/firebase';
import * as gameUtils from '../../utils/game-utils';
import * as utils from '../../utils/helpers';
import { PlainObject, Players, SaveGamePayload } from '../../utils/interfaces';
import {
  MAX_ROUNDS,
  QUESTION_COUNT,
  SUSPECTS_IDS,
  SUSPECT_COUNT,
  TESTEMUNHA_OCULAR_PHASES,
} from './constants';
import {
  calculateScore,
  determineTurnOrder,
  filterAvailableCards,
  getQuestioner,
  getQuestions,
} from './helpers';
import {
  FirebaseStateData,
  FirebaseStoreData,
  TestemunhaOcularCard,
  TestemunhaOcularEntry,
} from './interfaces';

/**
 * Setup
 * Build the card deck
 * Resets previous changes to the store
 * @returns
 */
export const prepareSetupPhase = async (additionalData: PlainObject): Promise<SaveGamePayload> => {
  // Build suspects grid
  const suspectsList = gameUtils.shuffle(SUSPECTS_IDS);
  const suspects = gameUtils.getRandomItems(suspectsList, SUSPECT_COUNT);
  const perpetrator = gameUtils.getRandomItem(suspects);

  // Filter used cards, if not enough cards, just use the full deck
  const filteredCards = filterAvailableCards(additionalData.allCards, additionalData.usedCards);
  const availableCards = filteredCards.length < QUESTION_COUNT ? additionalData.allCards : filteredCards;
  const shuffledAvailableCards = gameUtils.shuffle(availableCards);

  // Build deck
  const deck = gameUtils.getRandomItems(shuffledAvailableCards, QUESTION_COUNT);

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
        suspects,
        perpetrator,
        round: {
          current: 0,
          total: MAX_ROUNDS,
        },
        groupScore: 0,
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
        updatedAt: Date.now(),
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
      : determineTurnOrder(players, additionalPayload?.witness ?? state.witness);

  // Determine questioner player
  const questionerIndex = store.questionerIndex + 1;
  const questioner = getQuestioner(turnOrder, questionerIndex);
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
        updatedAt: Date.now(),
        round: utils.increaseRound(state.round),
        questioner,
        questions,
        question: firebaseUtils.deleteValue(),
        witness: additionalPayload?.witness ?? state.witness,
        testimony: firebaseUtils.deleteValue(),
        eliminatedSuspects: firebaseUtils.deleteValue(),
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
  const question = store.deck.find((card: TestemunhaOcularCard) => card.id === additionalPayload.questionId);

  // Save
  return {
    update: {
      state: {
        phase: TESTEMUNHA_OCULAR_PHASES.QUESTIONING,
        updatedAt: Date.now(),
        question,
        questions: firebaseUtils.deleteValue(),
      },
    },
  };
};

export const prepareTrialPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  additionalPayload: PlainObject
): Promise<SaveGamePayload> => {
  // Save
  return {
    update: {
      state: {
        phase: TESTEMUNHA_OCULAR_PHASES.TRIAL,
        updatedAt: Date.now(),
        testimony: additionalPayload?.testimony ?? state.testimony,
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
    set: {
      state: {
        phase: TESTEMUNHA_OCULAR_PHASES.GAME_OVER,
        gameEndedAt: Date.now(),
        round: state.round,
        perpetrator: state.perpetrator,
        groupScore: state.groupScore,
        outcome: additionalPayload?.win ? 'WIN' : 'LOSE',
      },
    },
  };
};
