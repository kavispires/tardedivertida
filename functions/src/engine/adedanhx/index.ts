// Constants
import { GAME_NAMES } from '../../utils/constants';
import { ADEDANHX_ACTIONS, ADEDANHX_PHASES, PLAYER_COUNTS, TOTAL_ROUNDS } from './constants';
// Types
import type {
  AdedanhxInitialState,
  AdedanhxOptions,
  AdedanhxSubmitAction,
  FirebaseStateData,
  FirebaseStoreData,
} from './types';
// Utils
import utils from '../../utils';
// Internal Functions
import { determineNextPhase } from './helpers';
import {
  prepareGameOverPhase,
  prepareSetupPhase,
  prepareAnsweringPhase,
  prepareResultsPhase,
  prepareEvaluationPhase,
} from './setup';
import { getTopics } from './data';
import { handleNextEvaluationGroup, handleSubmitAnswers, handleSubmitRejectAnswers } from './actions';

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
  options: AdedanhxOptions
): AdedanhxInitialState => {
  return utils.helpers.getDefaultInitialState<AdedanhxInitialState>({
    gameId,
    gameName: GAME_NAMES.ADEDANHX,
    uid,
    language,
    playerCounts: PLAYER_COUNTS,
    initialPhase: ADEDANHX_PHASES.LOBBY,
    totalRounds: TOTAL_ROUNDS,
    store: {},
    options,
  });
};

/**
 * Exposes min and max player count
 */
export const playerCounts = PLAYER_COUNTS;

export const getNextPhase = async (
  gameName: string,
  gameId: string,
  currentState?: FirebaseStateData
): Promise<boolean> => {
  const { sessionRef, state, store, players } = await utils.firebase.getStateAndStoreReferences<
    FirebaseStateData,
    FirebaseStoreData
  >(gameName, gameId, 'prepare next phase', currentState);

  // Determine next phase
  const nextPhase = determineNextPhase(state?.phase, state?.round);

  // RULES -> SETUP
  if (nextPhase === ADEDANHX_PHASES.SETUP) {
    // Enter setup phase before doing anything
    await utils.firebase.triggerSetupPhase(sessionRef);

    // Request data
    const additionalData = await getTopics(store.language);
    const newPhase = await prepareSetupPhase(store, state, players, additionalData);
    await utils.firebase.saveGame(sessionRef, newPhase);
    return getNextPhase(gameName, gameId);
  }

  // * -> ANSWERING
  if (nextPhase === ADEDANHX_PHASES.ANSWERING) {
    const newPhase = await prepareAnsweringPhase(store, state, players);
    return utils.firebase.saveGame(sessionRef, newPhase);
  }

  // ANSWERING -> EVALUATION
  if (nextPhase === ADEDANHX_PHASES.EVALUATION) {
    const newPhase = await prepareEvaluationPhase(store, state, players);
    return utils.firebase.saveGame(sessionRef, newPhase);
  }

  // EVALUATION -> RESULTS
  if (nextPhase === ADEDANHX_PHASES.RESULTS) {
    const newPhase = await prepareResultsPhase(store, state, players);
    return utils.firebase.saveGame(sessionRef, newPhase);
  }

  // RESULTS -> GAME_OVER
  if (nextPhase === ADEDANHX_PHASES.GAME_OVER) {
    const newPhase = await prepareGameOverPhase(gameId, store, state, players);
    return utils.firebase.saveGame(sessionRef, newPhase);
  }

  return true;
};

/**
 * Handles clue and guesses submissions
 * May trigger next phase
 */
export const submitAction = async (data: AdedanhxSubmitAction) => {
  const { gameId, gameName, playerId, action } = data;

  utils.firebase.validateSubmitActionPayload(gameId, gameName, playerId, action);

  switch (action) {
    case ADEDANHX_ACTIONS.SUBMIT_ANSWERS:
      utils.firebase.validateSubmitActionProperties(data, ['answers'], 'submit answers');
      return handleSubmitAnswers(gameName, gameId, playerId, data.answers, data.stop);
    case ADEDANHX_ACTIONS.NEXT_EVALUATION_GROUP:
      return handleNextEvaluationGroup(gameName, gameId, playerId);
    case ADEDANHX_ACTIONS.SUBMIT_REJECTED_ANSWERS:
      utils.firebase.validateSubmitActionProperties(data, ['evaluations'], 'submit evaluations');
      return handleSubmitRejectAnswers(gameName, gameId, playerId, data.evaluations);
    default:
      utils.firebase.throwException(`Given action ${action} is not allowed`);
  }
};
