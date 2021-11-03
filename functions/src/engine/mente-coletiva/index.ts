// Constants
import { GAME_COLLECTIONS, GAME_PLAYERS_LIMIT, GLOBAL_USED_DOCUMENTS } from '../../utils/constants';
import { MAX_NUMBER_OF_ROUNDS, MENTE_COLETIVA_PHASES } from './constants';
// Interfaces
import { GameId, Players } from '../../utils/interfaces';
import { MenteColetivaInitialState, MenteColetivaSubmitAction } from './interfaces';
// Utilities
import * as firebaseUtils from '../../utils/firebase';
import * as globalUtils from '../global';
// Internal Functions
import { determineNextPhase, determineGameOver, buildUsedQuestionIdsDict } from './helpers';
import {
  prepareSetupPhase,
  prepareGameOverPhase,
  prepareQuestionSelectionPhase,
  prepareEverybodyWritesPhase,
  prepareComparePhase,
  prepareResolutionPhase,
} from './setup';
import { getQuestions } from './data';
import { handleAddAnswer, handleNextAnswers, handleSubmitAnswers, handleSubmitQuestion } from './actions';

/**
 * Get Initial Game State
 * @param gameId
 * @param uid
 * @param language
 * @returns
 */
export const getInitialState = (
  gameId: GameId,
  uid: string,
  language: string
): MenteColetivaInitialState => ({
  meta: {
    gameId,
    gameName: GAME_COLLECTIONS.MENTE_COLETIVA,
    createdAt: Date.now(),
    createdBy: uid,
    min: GAME_PLAYERS_LIMIT.MENTE_COLETIVA.min,
    max: GAME_PLAYERS_LIMIT.MENTE_COLETIVA.max,
    isLocked: false,
    isComplete: false,
    language,
    replay: 0,
  },
  players: {},
  store: {
    language,
    deck: [],
    gameOrder: [],
    pastQuestions: [],
  },
  state: {
    phase: MENTE_COLETIVA_PHASES.LOBBY,
    round: {
      current: 0,
      total: MAX_NUMBER_OF_ROUNDS,
    },
    updatedAt: Date.now(),
  },
});

export const nextMenteColetivaPhase = async (
  collectionName: string,
  gameId: string,
  players: Players
): Promise<boolean> => {
  const actionText = 'prepare next phase';

  // Gather docs and references
  const sessionRef = firebaseUtils.getSessionRef(collectionName, gameId);
  const stateDoc = await firebaseUtils.getSessionDoc(collectionName, gameId, 'state', actionText);
  const storeDoc = await firebaseUtils.getSessionDoc(collectionName, gameId, 'store', actionText);

  const state = stateDoc.data() ?? {};
  const store = { ...(storeDoc.data() ?? {}) };

  // Determine if it's game over
  const isGameOver = determineGameOver(players);
  // Determine next phase
  const nextPhase = determineNextPhase(state?.phase, state.round.current, isGameOver);

  // RULES -> SETUP
  if (nextPhase === MENTE_COLETIVA_PHASES.SETUP) {
    // Request data
    const additionalData = await getQuestions(store.language);
    const newPhase = await prepareSetupPhase(store, state, players, additionalData);
    await firebaseUtils.saveGame(sessionRef, newPhase);
    return nextMenteColetivaPhase(collectionName, gameId, players);
  }

  // SETUP/* -> QUESTION_SELECTION
  if (nextPhase === MENTE_COLETIVA_PHASES.QUESTION_SELECTION) {
    const newPhase = await prepareQuestionSelectionPhase(store, state, players);
    return firebaseUtils.saveGame(sessionRef, newPhase);
  }

  // QUESTION_SELECTION -> EVERYBODY_WRITES
  if (nextPhase === MENTE_COLETIVA_PHASES.EVERYBODY_WRITES) {
    const newPhase = await prepareEverybodyWritesPhase(store, state, players);
    return firebaseUtils.saveGame(sessionRef, newPhase);
  }

  // EVERYBODY_WRITES -> COMPARE
  if (nextPhase === MENTE_COLETIVA_PHASES.COMPARE) {
    const newPhase = await prepareComparePhase(store, state, players);
    return firebaseUtils.saveGame(sessionRef, newPhase);
  }

  // COMPARE -> RESOLUTION
  if (nextPhase === MENTE_COLETIVA_PHASES.RESOLUTION) {
    const newPhase = await prepareResolutionPhase(store, state, players);
    return firebaseUtils.saveGame(sessionRef, newPhase);
  }

  // GUESS -> GAME_OVER
  if (nextPhase === MENTE_COLETIVA_PHASES.GAME_OVER) {
    const newPhase = await prepareGameOverPhase(store, state, players);

    // Save usedMenteColetivaQuestions to global
    const usedMenteColetivaQuestions = buildUsedQuestionIdsDict(store.pastQuestions);
    await globalUtils.updateGlobalFirebaseDoc(
      GLOBAL_USED_DOCUMENTS.MENTE_COLETIVA,
      usedMenteColetivaQuestions
    );

    return firebaseUtils.saveGame(sessionRef, newPhase);
  }

  return true;
};

/**
 * Handles question and answers submissions
 * May trigger next phase
 */
export const submitAction = async (data: MenteColetivaSubmitAction) => {
  const { gameId, gameName: collectionName, playerId, action } = data;

  const actionText = 'submit action';
  firebaseUtils.verifyPayload(gameId, 'gameId', actionText);
  firebaseUtils.verifyPayload(collectionName, 'collectionName', actionText);
  firebaseUtils.verifyPayload(playerId, 'playerId', actionText);
  firebaseUtils.verifyPayload(action, 'action', actionText);

  switch (action) {
    case 'SUBMIT_QUESTION':
      if (!data.questionId) {
        firebaseUtils.throwException('Missing `questionId` value', 'submit question');
      }
      return handleSubmitQuestion(collectionName, gameId, playerId, data.questionId);
    case 'SUBMIT_ANSWERS':
      if (!data.answers) {
        firebaseUtils.throwException('Missing `answers` value', 'submit answers');
      }

      return handleSubmitAnswers(collectionName, gameId, playerId, data.answers);
    case 'NEXT_ANSWERS':
      if (!data.allowedList) {
        firebaseUtils.throwException('Missing `allowedList` value', 'advance answers');
      }
      return handleNextAnswers(collectionName, gameId, playerId, data.allowedList);
    case 'ADD_ANSWER':
      if (!data.answer) {
        firebaseUtils.throwException('Missing `answer` value', 'add answer');
      }
      return handleAddAnswer(collectionName, gameId, playerId, data.answer);
    default:
      firebaseUtils.throwException(`Given action ${action} is not allowed`);
  }
};
