// Constants
import { GAME_COLLECTIONS } from '../../utils/constants';
import { MAX_ROUNDS, PLAYER_COUNTS, TESTEMUNHA_OCULAR_PHASES } from './constants';
// Types
import type { TestemunhaOcularInitialState, TestemunhaOcularSubmitAction } from './types';
// Utils
import * as utils from '../../utils';
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
import { getQuestionsAndSuspects, saveUsedQUestions } from './data';

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
): TestemunhaOcularInitialState => {
  return utils.helpers.getDefaultInitialState({
    gameId,
    gameName: GAME_COLLECTIONS.TESTEMUNHA_OCULAR,
    uid,
    language,
    playerCounts: PLAYER_COUNTS,
    initialPhase: TESTEMUNHA_OCULAR_PHASES.LOBBY,
    totalRounds: MAX_ROUNDS,
    store: {
      pastQuestions: [],
      gameOrder: [],
      turnOrder: [],
    },
  });
};

/**
 * Exposes min and max player count
 */
export const playerCounts = PLAYER_COUNTS;

export const getNextPhase = async (
  collectionName: string,
  gameId: string,
  players: Players,
  additionalPayload?: PlainObject
): Promise<boolean> => {
  const { sessionRef, state, store } = await utils.firebase.getStateAndStoreReferences(
    collectionName,
    gameId,
    'prepare next phase'
  );

  // Determine next phase
  const nextPhase = determineNextPhase(
    state?.phase,
    state?.round,
    additionalPayload?.lose,
    additionalPayload?.win,
    state?.lastRound
  );

  // RULES -> SETUP
  if (nextPhase === TESTEMUNHA_OCULAR_PHASES.SETUP) {
    // Enter setup phase before doing anything
    await utils.firebase.triggerSetupPhase(sessionRef);

    // Request data
    const additionalData = await getQuestionsAndSuspects(store.language);
    const newPhase = await prepareSetupPhase(additionalData);
    await utils.firebase.saveGame(sessionRef, newPhase);
    return getNextPhase(collectionName, gameId, players);
  }

  // SETUP -> WITNESS_SELECTION
  if (nextPhase === TESTEMUNHA_OCULAR_PHASES.WITNESS_SELECTION) {
    const newPhase = await prepareWitnessSelectionPhase(players);
    return utils.firebase.saveGame(sessionRef, newPhase);
  }

  // * -> QUESTION_SELECTION
  if (nextPhase === TESTEMUNHA_OCULAR_PHASES.QUESTION_SELECTION) {
    const newPhase = await prepareQuestionSelectionPhase(store, state, players, additionalPayload ?? {});
    return utils.firebase.saveGame(sessionRef, newPhase);
  }

  // QUESTION_SELECTION -> QUESTIONING
  if (nextPhase === TESTEMUNHA_OCULAR_PHASES.QUESTIONING) {
    const newPhase = await prepareQuestioningPhase(store, state, players, additionalPayload ?? {});
    return utils.firebase.saveGame(sessionRef, newPhase);
  }

  // QUESTIONING -> TRIAL
  if (nextPhase === TESTEMUNHA_OCULAR_PHASES.TRIAL) {
    const newPhase = await prepareTrialPhase(store, state, players, additionalPayload ?? {});
    return utils.firebase.saveGame(sessionRef, newPhase);
  }

  // TRIAL -> GAME_OVER
  if (nextPhase === TESTEMUNHA_OCULAR_PHASES.GAME_OVER) {
    const newPhase = await prepareGameOverPhase(store, state, additionalPayload ?? {});

    // Save usedTestemunhaOcularCards to global
    await saveUsedQUestions(store.pastQuestions);

    // TODO: Save testimonies to public gallery

    return utils.firebase.saveGame(sessionRef, newPhase);
  }

  return true;
};

/**
 * Perform action submitted by the app
 * @param data
 * @returns
 */
export const submitAction = async (data: TestemunhaOcularSubmitAction) => {
  const { gameId, gameName: collectionName, playerId, action } = data;

  utils.firebase.validateSubmitActionPayload(gameId, collectionName, playerId, action);

  let actionText = 'submit action';

  switch (action) {
    case 'SELECT_WITNESS':
      actionText = 'select witness';
      utils.firebase.validateSubmitActionProperties(data, ['witnessId'], actionText);
      return handleExtraAction(collectionName, gameId, actionText, { playerId, witnessId: data.witnessId });

    case 'SELECT_QUESTION':
      actionText = 'select question';
      utils.firebase.validateSubmitActionProperties(data, ['questionId'], actionText);
      return handleExtraAction(collectionName, gameId, actionText, { playerId, questionId: data.questionId });

    case 'GIVE_TESTIMONY':
      actionText = 'give testimony';
      utils.firebase.validateSubmitActionProperties(data, ['testimony'], actionText);
      return handleExtraAction(collectionName, gameId, actionText, { playerId, testimony: data.testimony });

    case 'ELIMINATE_SUSPECT':
      actionText = 'eliminate suspect';
      utils.firebase.validateSubmitActionProperties(data, ['suspectId', 'pass'], actionText);
      return handleElimination(collectionName, gameId, actionText, {
        playerId,
        suspectId: data?.suspectId,
        pass: data?.pass,
      });

    default:
      utils.firebase.throwException(`Given action ${action} is not allowed`);
  }
};
