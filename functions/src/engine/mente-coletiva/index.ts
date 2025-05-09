// Constants
import { GAME_NAMES } from '../../utils/constants';
import { MENTE_COLETIVA_PHASES, MAX_ROUNDS, PLAYER_COUNTS, MENTE_COLETIVA_ACTIONS } from './constants';
// Types
import type {
  FirebaseStateData,
  FirebaseStoreData,
  MenteColetivaInitialState,
  MenteColetivaOptions,
  MenteColetivaSubmitAction,
} from './types';
// Utilities
import utils from '../../utils';
// Internal Functions
import { determineNextPhase, determineGameOver } from './helpers';
import {
  prepareSetupPhase,
  prepareGameOverPhase,
  prepareQuestionSelectionPhase,
  prepareEverybodyWritesPhase,
  prepareComparePhase,
  prepareResolutionPhase,
} from './setup';
import { getQuestions } from './data';
import {
  handleAddAnswer,
  handleNextAnswers,
  handleSubmitAnswers,
  handleSubmitCustomQuestion,
  handleSubmitQuestion,
} from './actions';

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
  language: Language,
  version: string,
  options: MenteColetivaOptions,
): MenteColetivaInitialState => {
  return utils.helpers.getDefaultInitialState<MenteColetivaInitialState>({
    gameId,
    gameName: GAME_NAMES.MENTE_COLETIVA,
    uid,
    language,
    version,
    playerCounts: PLAYER_COUNTS,
    initialPhase: MENTE_COLETIVA_PHASES.LOBBY,
    totalRounds: MAX_ROUNDS,
    store: {
      deck: [],
      gameOrder: [],
      pastQuestions: [],
    },
    options,
  });
};

/**
 * Exposes min and max player count
 */
export const getPlayerCounts = () => PLAYER_COUNTS;

export const getNextPhase = async (
  gameName: string,
  gameId: string,
  currentState?: FirebaseStateData,
): Promise<boolean> => {
  const { sessionRef, state, store, players } = await utils.firestore.getStateAndStoreReferences<
    FirebaseStateData,
    FirebaseStoreData
  >(gameName, gameId, 'prepare next phase', currentState);

  // Determine if it's game over
  const isGameOver = determineGameOver(players, store.options?.shortPasture);
  // Determine next phase
  const nextPhase = determineNextPhase(state?.phase, state.round, isGameOver);

  // LOBBY -> SETUP
  if (nextPhase === MENTE_COLETIVA_PHASES.SETUP) {
    // Enter setup phase before doing anything
    await utils.firestore.triggerSetupPhase(sessionRef);

    // Request data
    const additionalData = await getQuestions(store.language);
    const newPhase = await prepareSetupPhase(store, state, players, additionalData);
    await utils.firestore.saveGame(sessionRef, newPhase);
    return getNextPhase(gameName, gameId);
  }

  // SETUP/* -> QUESTION_SELECTION
  if (nextPhase === MENTE_COLETIVA_PHASES.QUESTION_SELECTION) {
    const newPhase = await prepareQuestionSelectionPhase(store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  // QUESTION_SELECTION -> EVERYBODY_WRITES
  if (nextPhase === MENTE_COLETIVA_PHASES.EVERYBODY_WRITES) {
    const newPhase = await prepareEverybodyWritesPhase(store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  // EVERYBODY_WRITES -> COMPARE
  if (nextPhase === MENTE_COLETIVA_PHASES.COMPARE) {
    const newPhase = await prepareComparePhase(store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  // COMPARE -> RESOLUTION
  if (nextPhase === MENTE_COLETIVA_PHASES.RESOLUTION) {
    const newPhase = await prepareResolutionPhase(store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  // GUESS -> GAME_OVER
  if (nextPhase === MENTE_COLETIVA_PHASES.GAME_OVER) {
    const newPhase = await prepareGameOverPhase(gameId, store, state, players);

    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  return true;
};

/**
 * Handles question and answers submissions
 * May trigger next phase
 */
export const submitAction = async (data: MenteColetivaSubmitAction) => {
  const { gameId, gameName, playerId, action } = data;

  utils.firebase.validateSubmitActionPayload(gameId, gameName, playerId, action);

  switch (action) {
    case MENTE_COLETIVA_ACTIONS.SUBMIT_QUESTION:
      utils.firebase.validateSubmitActionProperties(data, ['questionId'], 'submit question');
      return handleSubmitQuestion(gameName, gameId, playerId, data.questionId);
    case MENTE_COLETIVA_ACTIONS.SUBMIT_CUSTOM_QUESTION:
      utils.firebase.validateSubmitActionProperties(data, ['customQuestion'], 'submit question');
      return handleSubmitCustomQuestion(gameName, gameId, playerId, data.customQuestion);
    case MENTE_COLETIVA_ACTIONS.SUBMIT_ANSWERS:
      utils.firebase.validateSubmitActionProperties(data, ['answers'], 'submit answers');
      return handleSubmitAnswers(gameName, gameId, playerId, data.answers);
    case MENTE_COLETIVA_ACTIONS.NEXT_ANSWERS:
      utils.firebase.validateSubmitActionProperties(data, ['allowedList'], 'advance answers');
      return handleNextAnswers(gameName, gameId, playerId, data.allowedList);
    case MENTE_COLETIVA_ACTIONS.ADD_ANSWER:
      utils.firebase.validateSubmitActionProperties(data, ['answer'], 'add answer');
      return handleAddAnswer(gameName, gameId, playerId, data.answer);
    default:
      utils.firebase.throwException(`Given action ${action} is not allowed`, action);
  }
};
