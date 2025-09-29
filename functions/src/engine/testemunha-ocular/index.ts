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
import { handleElimination, handleExtraAction } from './actions';
import { getQuestionsAndSuspects } from './data';

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
  language: string,
  version: string,
  options: TestemunhaOcularOptions,
): TestemunhaOcularInitialState => {
  return utils.helpers.getDefaultInitialState<TestemunhaOcularInitialState>({
    gameId,
    gameName: GAME_NAMES.TESTEMUNHA_OCULAR,
    uid,
    language,
    version,
    playerCounts: PLAYER_COUNTS,
    initialPhase: TESTEMUNHA_OCULAR_PHASES.LOBBY,
    totalRounds: MAX_ROUNDS,
    store: {
      gameOrder: [],
      turnOrder: [],
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
  additionalPayload?: PlainObject,
): Promise<boolean> => {
  const { sessionRef, state, store, players } = await utils.firestore.getStateAndStoreReferences<
    FirebaseStateData,
    FirebaseStoreData
  >(gameName, gameId, 'prepare next phase', currentState);

  // Determine next phase
  const nextPhase = determineNextPhase(
    state?.phase,
    state?.round,
    additionalPayload?.lose,
    additionalPayload?.win,
  );

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
    const newPhase = await prepareQuestionSelectionPhase(store, state, players, additionalPayload ?? {});
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  // QUESTION_SELECTION -> QUESTIONING
  if (nextPhase === TESTEMUNHA_OCULAR_PHASES.QUESTIONING) {
    const newPhase = await prepareQuestioningPhase(store, state, players, additionalPayload ?? {});
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  // QUESTIONING -> TRIAL
  if (nextPhase === TESTEMUNHA_OCULAR_PHASES.TRIAL) {
    const newPhase = await prepareTrialPhase(store, state, players, additionalPayload ?? {});
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  // TRIAL -> GAME_OVER
  if (nextPhase === TESTEMUNHA_OCULAR_PHASES.GAME_OVER) {
    const newPhase = await prepareGameOverPhase(gameId, store, state, players, additionalPayload ?? {});

    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  return true;
};

/**
 * Perform action submitted by the app
 * @param data
 * @returns
 */
export const submitAction = async (data: TestemunhaOcularSubmitAction) => {
  const { gameId, gameName, playerId, action } = data;

  utils.firebase.validateSubmitActionPayload(gameId, gameName, playerId, action);

  let actionText = 'submit action';

  switch (action) {
    case TESTEMUNHA_OCULAR_ACTIONS.SELECT_WITNESS:
      actionText = 'select witness';
      utils.firebase.validateSubmitActionProperties(data, ['witnessId'], actionText);
      return handleExtraAction(gameName, gameId, actionText, { playerId, witnessId: data.witnessId });

    case TESTEMUNHA_OCULAR_ACTIONS.SELECT_QUESTION:
      actionText = 'select question';
      utils.firebase.validateSubmitActionProperties(data, ['questionId'], actionText);
      return handleExtraAction(gameName, gameId, actionText, { playerId, questionId: data.questionId });

    case TESTEMUNHA_OCULAR_ACTIONS.GIVE_TESTIMONY:
      actionText = 'give testimony';
      utils.firebase.validateSubmitActionProperties(data, ['testimony'], actionText);
      return handleExtraAction(gameName, gameId, actionText, { playerId, testimony: data.testimony });

    case TESTEMUNHA_OCULAR_ACTIONS.ELIMINATE_SUSPECT:
      actionText = 'eliminate suspect';
      utils.firebase.validateSubmitActionProperties(data, ['suspectId', 'pass'], actionText);
      return handleElimination(gameName, gameId, actionText, {
        playerId,
        suspectId: data?.suspectId,
        pass: data?.pass,
      });

    default:
      utils.firebase.throwException(`Given action ${action} is not allowed`, action);
  }
};
