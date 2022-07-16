// Constants
import { GAME_COLLECTIONS } from '../../utils/constants';
import { MENTE_COLETIVA_PHASES, MAX_ROUNDS, PLAYER_COUNTS } from './constants';
// Types
import type { GameId, Language, Players } from '../../utils/types';
import type { MenteColetivaInitialState, MenteColetivaOptions, MenteColetivaSubmitAction } from './types';
// Utilities
import * as utils from '../../utils';
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
import { getQuestions, saveUsedQuestions } from './data';
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
  language: Language,
  options: MenteColetivaOptions
): MenteColetivaInitialState => {
  return utils.helpers.getDefaultInitialState({
    gameId,
    gameName: GAME_COLLECTIONS.MENTE_COLETIVA,
    uid,
    language,
    playerCounts: PLAYER_COUNTS,
    initialPhase: MENTE_COLETIVA_PHASES.LOBBY,
    totalRounds: MAX_ROUNDS,
    store: {
      language,
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
export const playerCounts = PLAYER_COUNTS;

export const getNextPhase = async (
  collectionName: string,
  gameId: string,
  players: Players
): Promise<boolean> => {
  const actionText = 'prepare next phase';

  // Gather docs and references
  const sessionRef = utils.firebase.getSessionRef(collectionName, gameId);
  const stateDoc = await utils.firebase.getSessionDoc(collectionName, gameId, 'state', actionText);
  const storeDoc = await utils.firebase.getSessionDoc(collectionName, gameId, 'store', actionText);

  const state = stateDoc.data() ?? {};
  const store = { ...(storeDoc.data() ?? {}) };

  // Determine if it's game over
  const isGameOver = determineGameOver(players, store.options?.shortPasture);
  // Determine next phase
  const nextPhase = determineNextPhase(state?.phase, state.round.current, isGameOver, state?.lastRound);

  // RULES -> SETUP
  if (nextPhase === MENTE_COLETIVA_PHASES.SETUP) {
    // Enter setup phase before doing anything
    await utils.firebase.triggerSetupPhase(sessionRef);

    // Request data
    const additionalData = await getQuestions(store.language);
    const newPhase = await prepareSetupPhase(store, state, players, additionalData);
    await utils.firebase.saveGame(sessionRef, newPhase);

    return getNextPhase(collectionName, gameId, players);
  }

  // SETUP/* -> QUESTION_SELECTION
  if (nextPhase === MENTE_COLETIVA_PHASES.QUESTION_SELECTION) {
    const newPhase = await prepareQuestionSelectionPhase(store, state, players);
    return utils.firebase.saveGame(sessionRef, newPhase);
  }

  // QUESTION_SELECTION -> EVERYBODY_WRITES
  if (nextPhase === MENTE_COLETIVA_PHASES.EVERYBODY_WRITES) {
    const newPhase = await prepareEverybodyWritesPhase(store, state, players);
    return utils.firebase.saveGame(sessionRef, newPhase);
  }

  // EVERYBODY_WRITES -> COMPARE
  if (nextPhase === MENTE_COLETIVA_PHASES.COMPARE) {
    const newPhase = await prepareComparePhase(store, state, players);
    return utils.firebase.saveGame(sessionRef, newPhase);
  }

  // COMPARE -> RESOLUTION
  if (nextPhase === MENTE_COLETIVA_PHASES.RESOLUTION) {
    const newPhase = await prepareResolutionPhase(store, state, players);
    return utils.firebase.saveGame(sessionRef, newPhase);
  }

  // GUESS -> GAME_OVER
  if (nextPhase === MENTE_COLETIVA_PHASES.GAME_OVER) {
    const newPhase = await prepareGameOverPhase(store, state, players);

    // Save usedMenteColetivaQuestions to global
    await saveUsedQuestions(store.pastQuestions);

    return utils.firebase.saveGame(sessionRef, newPhase);
  }

  return true;
};

/**
 * Handles question and answers submissions
 * May trigger next phase
 */
export const submitAction = async (data: MenteColetivaSubmitAction) => {
  const { gameId, gameName: collectionName, playerId, action } = data;

  utils.firebase.validateSubmitActionPayload(gameId, collectionName, playerId, action);

  switch (action) {
    case 'SUBMIT_QUESTION':
      utils.firebase.validateSubmitActionProperties(data, ['questionId'], 'submit question');
      return handleSubmitQuestion(collectionName, gameId, playerId, data.questionId);
    case 'SUBMIT_ANSWERS':
      utils.firebase.validateSubmitActionProperties(data, ['answers'], 'submit answers');
      return handleSubmitAnswers(collectionName, gameId, playerId, data.answers);
    case 'NEXT_ANSWERS':
      utils.firebase.validateSubmitActionProperties(data, ['allowedList'], 'advance answers');
      return handleNextAnswers(collectionName, gameId, playerId, data.allowedList);
    case 'ADD_ANSWER':
      utils.firebase.validateSubmitActionProperties(data, ['answer'], 'add answer');
      return handleAddAnswer(collectionName, gameId, playerId, data.answer);
    default:
      utils.firebase.throwException(`Given action ${action} is not allowed`);
  }
};
