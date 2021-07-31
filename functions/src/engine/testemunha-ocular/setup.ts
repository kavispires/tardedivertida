// Interfaces
import * as gameUtils from '../../utils/game-utils';
import * as utils from '../../utils/helpers';
import { PlainObject, Players, SaveGamePayload } from '../../utils/interfaces';
import {
  MAX_NUMBER_OF_ROUNDS,
  QUESTION_COUNT,
  SUSPECTS_IDS,
  SUSPECT_COUNT,
  TESTEMUNHA_OCULAR_PHASES,
} from './constants';
import { determineTurnOrder, filterAvailableCards, getQuestioner, getQuestions } from './helpers';
import { FirebaseStateData, FirebaseStoreData, TestemunhaOcularCard } from './interfaces';

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
        currentDeckIndex: 0,
        pastQuestions: [],
      },
      state: {
        phase: TESTEMUNHA_OCULAR_PHASES.SETUP,
        suspects,
        round: {
          current: 0,
          total: MAX_NUMBER_OF_ROUNDS,
        },
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
  const turnOrder = store.turnOrder.length > 0 ? store.turnOrder : determineTurnOrder(players, store.witness);

  // Determine questioner player
  const questionerIndex = store.questionerIndex ? store.questionerIndex + 1 : 0;
  const questioner = getQuestioner(turnOrder, questionerIndex);

  // Determine questions
  const questionIndex = store.questionIndex ? store.questionIndex + 2 : 0;
  const questions = getQuestions(store.deck, questionIndex);

  // Save
  return {
    update: {
      store: {
        turnOrder,
        gameOrder: turnOrder,
        questionerIndex,
        questionIndex,
      },
      state: {
        phase: TESTEMUNHA_OCULAR_PHASES.QUESTION_SELECTION,
        updatedAt: Date.now(),
        round: utils.increaseRound(state.round),
        questioner,
        questions,
        witness: additionalPayload?.witness ?? state.witness,
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
      },
    },
  };
};
