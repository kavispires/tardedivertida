// Types
import type {
  AdedanhxInitialState,
  AdedanhxOptions,
  AdedanhxSubmitAction,
  FirebaseStateData,
  FirebaseStoreData,
} from './types';
// Constants
import { GAME_NAMES } from '../../constants/games';
import { ADEDANHX_ACTIONS, ADEDANHX_PHASES, PLAYER_COUNTS, TOTAL_ROUNDS } from './constants';
// Services
import {
  validateSubmitActionPayload,
  validateSubmitActionProperties,
  throwHttpsError,
} from '../../services/firebase-core';
import { getStateAndStoreReferences, saveGame, triggerSetupPhase } from '../../services/game-session';
// Utils
import utils from '../../utils_LEGACY';
// Internal
import { handleSubmitAnswers, handleSubmitEvaluationsAnswers } from './actions';
import { getTopics } from './data';
import { determineNextPhase } from './helpers';
import {
  prepareGameOverPhase,
  prepareSetupPhase,
  prepareAnsweringPhase,
  prepareResultsPhase,
  prepareEvaluationPhase,
} from './setup';

/**
 * Gets the initial state for a new game session
 * @param gameId - The game session ID
 * @param uid - The user ID of the game creator
 * @param language - The language code
 * @param version - The game version
 * @param options - Optional game configuration options
 */
export const getInitialState = (
  gameId: UID,
  uid: string,
  language: Language,
  version: string,
  options: AdedanhxOptions,
): AdedanhxInitialState => {
  return utils.game.getDefaultInitialState<AdedanhxInitialState>({
    gameId,
    gameName: GAME_NAMES.ADEDANHX,
    uid,
    language,
    version,
    playerCounts: PLAYER_COUNTS,
    totalRounds: TOTAL_ROUNDS,
    store: {},
    options,
  });
};

/**
 * Gets the player count requirements for the game
 */
export const getPlayerCounts = () => PLAYER_COUNTS;

/**
 * Handles phase progression and prepares the next game phase
 * @param gameName - The name of the game
 * @param gameId - The game session ID
 */
export const getNextPhase = async (
  gameName: string,
  gameId: string,
  currentState?: FirebaseStateData,
): Promise<boolean> => {
  const { sessionRef, state, store, players } = await getStateAndStoreReferences<
    FirebaseStateData,
    FirebaseStoreData
  >(gameName, gameId, 'prepare next phase', currentState);

  // Determine next phase
  const nextPhase = determineNextPhase(state?.phase, state?.round);

  // LOBBY -> SETUP
  if (nextPhase === ADEDANHX_PHASES.SETUP) {
    // Enter setup phase before doing anything
    await triggerSetupPhase(sessionRef);

    // Request data
    const additionalData = await getTopics(store.language);
    const newPhase = await prepareSetupPhase(store, state, players, additionalData);
    await saveGame(sessionRef, newPhase);
    return getNextPhase(gameName, gameId);
  }

  // * -> ANSWERING
  if (nextPhase === ADEDANHX_PHASES.ANSWERING) {
    const newPhase = await prepareAnsweringPhase(store, state, players);
    return saveGame(sessionRef, newPhase);
  }

  // ANSWERING -> EVALUATION
  if (nextPhase === ADEDANHX_PHASES.EVALUATION) {
    const newPhase = await prepareEvaluationPhase(store, state, players);
    return saveGame(sessionRef, newPhase);
  }

  // EVALUATION -> RESULTS
  if (nextPhase === ADEDANHX_PHASES.RESULTS) {
    const newPhase = await prepareResultsPhase(store, state, players);
    return saveGame(sessionRef, newPhase);
  }

  // RESULTS -> GAME_OVER
  if (nextPhase === ADEDANHX_PHASES.GAME_OVER) {
    const newPhase = await prepareGameOverPhase(gameId, store, state, players);
    return saveGame(sessionRef, newPhase);
  }

  return true;
};

/**
 * Handles player action submissions and routes to appropriate handlers
 * @param data - The action data containing player information and action payload
 */
export const submitAction = async (data: AdedanhxSubmitAction) => {
  const { gameId, gameName, playerId, action } = data;

  validateSubmitActionPayload(gameId, gameName, playerId, action);

  switch (action) {
    case ADEDANHX_ACTIONS.SUBMIT_ANSWERS:
      validateSubmitActionProperties(data, ['answers'], 'submit answers');
      return handleSubmitAnswers(gameName, gameId, playerId, data.answers, data.stop);
    case ADEDANHX_ACTIONS.SUBMIT_EVALUATIONS:
      validateSubmitActionProperties(data, ['evaluations'], 'submit evaluations');
      return handleSubmitEvaluationsAnswers(gameName, gameId, playerId, data.evaluations);
    default:
      throwHttpsError(`Given action ${action} is not allowed`, action);
  }
};
