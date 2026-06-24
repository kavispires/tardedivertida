// Constants
import { GAME_NAMES } from '../../utils/constants';
import { MAX_ROUNDS, PLAYER_COUNTS, TESTEMUNHA_OCULAR_ACTIONS, TESTEMUNHA_OCULAR_PHASES } from './constants';
// Types
import type {
  FirebaseStateData,
  FirebaseStoreData,
  TestemunhaOcularInitialState,
  TestemunhaOcularOptions,
  TestemunhaOcularSubmitAction,
} from './types';
// Utils
import utils from '../../utils';
// Internal Functions
import { determineNextPhase } from './helpers';
import {
  prepareGameOverPhase,
  prepareQuestioningPhase,
  prepareQuestionSelectionPhase,
  prepareSetupPhase,
  prepareTrialPhase,
  prepareWitnessSelectionPhase,
} from './setup';
import {
  handleElimination,
  handleFinalElimination,
  handleGiveTestimony,
  handleSelectQuestion,
  handleSelectWitness,
} from './actions';
import { getQuestionsAndSuspects } from './data';
import {
  validateSubmitActionPayload,
  validateSubmitActionProperties,
  throwHttpsError,
} from '../../services/firebase-core';

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
  language: string,
  version: string,
  options: TestemunhaOcularOptions,
): TestemunhaOcularInitialState => {
  return utils.game.getDefaultInitialState<TestemunhaOcularInitialState>({
    gameId,
    gameName: GAME_NAMES.TESTEMUNHA_OCULAR,
    uid,
    language,
    version,
    playerCounts: PLAYER_COUNTS,
    totalRounds: MAX_ROUNDS,
    store: {
      gameOrder: [],
      turnOrder: [],
    },
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
  // additionalPayload?: PlainObject,
): Promise<boolean> => {
  const { sessionRef, state, store, players } = await utils.firestore.getStateAndStoreReferences<
    FirebaseStateData,
    FirebaseStoreData
  >(gameName, gameId, 'prepare next phase', currentState);

  // Determine next phase
  const nextPhase = determineNextPhase(state?.phase, state?.round, state?.outcome);

  // LOBBY -> SETUP
  if (nextPhase === TESTEMUNHA_OCULAR_PHASES.SETUP) {
    // Enter setup phase before doing anything
    await utils.firestore.triggerSetupPhase(sessionRef);

    // Request data
    const additionalData = await getQuestionsAndSuspects(store.language, store.options);
    const newPhase = await prepareSetupPhase(store, players, additionalData);
    await utils.firestore.saveGame(sessionRef, newPhase);
    return getNextPhase(gameName, gameId);
  }

  // SETUP -> WITNESS_SELECTION
  if (nextPhase === TESTEMUNHA_OCULAR_PHASES.WITNESS_SELECTION) {
    const newPhase = await prepareWitnessSelectionPhase(players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  // * -> QUESTION_SELECTION
  if (nextPhase === TESTEMUNHA_OCULAR_PHASES.QUESTION_SELECTION) {
    const newPhase = await prepareQuestionSelectionPhase(store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  // QUESTION_SELECTION -> QUESTIONING
  if (nextPhase === TESTEMUNHA_OCULAR_PHASES.QUESTIONING) {
    const newPhase = await prepareQuestioningPhase(store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  // QUESTIONING -> TRIAL
  if (nextPhase === TESTEMUNHA_OCULAR_PHASES.TRIAL) {
    const newPhase = await prepareTrialPhase(store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  // TRIAL -> GAME_OVER
  if (nextPhase === TESTEMUNHA_OCULAR_PHASES.GAME_OVER) {
    const newPhase = await prepareGameOverPhase(gameId, store, state, players);

    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  return true;
};

/**
 * Handles player action submissions and routes to appropriate handlers
 * @param data - The action data containing player information and action payload
 */
export const submitAction = async (data: TestemunhaOcularSubmitAction) => {
  const { gameId, gameName, playerId, action } = data;

  validateSubmitActionPayload(gameId, gameName, playerId, action);

  let actionText = 'submit action';

  switch (action) {
    case TESTEMUNHA_OCULAR_ACTIONS.SELECT_WITNESS:
      actionText = 'select witness';
      validateSubmitActionProperties(data, ['witnessId'], actionText);
      return handleSelectWitness(gameName, gameId, playerId, data.witnessId);

    case TESTEMUNHA_OCULAR_ACTIONS.SELECT_QUESTION:
      actionText = 'select question';
      validateSubmitActionProperties(data, ['questionId'], actionText);
      return handleSelectQuestion(gameName, gameId, playerId, data.questionId);

    case TESTEMUNHA_OCULAR_ACTIONS.GIVE_TESTIMONY:
      actionText = 'give testimony';
      validateSubmitActionProperties(data, ['testimony'], actionText);
      return handleGiveTestimony(gameName, gameId, playerId, data.testimony);

    case TESTEMUNHA_OCULAR_ACTIONS.ELIMINATE_SUSPECT:
      actionText = 'eliminate suspect';
      validateSubmitActionProperties(data, ['suspectId', 'pass'], actionText);
      return handleElimination(gameName, gameId, actionText, {
        suspectId: data?.suspectId,
        pass: data?.pass,
      });
    case TESTEMUNHA_OCULAR_ACTIONS.FINAL_ELIMINATION:
      actionText = 'final elimination';
      validateSubmitActionProperties(data, ['suspectId'], actionText);
      return handleFinalElimination(gameName, gameId, playerId, data.suspectId);

    default:
      throwHttpsError(`Given action ${action} is not allowed`, action);
  }
};
