// Constants
import { GAME_COLLECTIONS, GAME_PLAYERS_LIMIT } from '../../utils/constants';
import { TESTEMUNHA_OCULAR_PHASES } from './constants';
// Interfaces
import { GameId, PlainObject, Players } from '../../utils/interfaces';
import { TestemunhaOcularInitialState, TestemunhaOcularSubmitAction } from './interfaces';
// Utils
import * as firebaseUtils from '../../utils/firebase';
import * as globalUtils from '../global';
import { buildUsedCardsIdsDict, determineNextPhase } from './helpers';
// Internal Functions
import {
  prepareGameOverPhase,
  prepareQuestioningPhase,
  prepareQuestionSelectionPhase,
  prepareSetupPhase,
  prepareTrialPhase,
  prepareWitnessSelectionPhase,
} from './setup';
import { handleElimination, handleExtraAction } from './actions';
import { getQuestions } from './data';

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
): TestemunhaOcularInitialState => ({
  meta: {
    gameId,
    gameName: GAME_COLLECTIONS.TESTEMUNHA_OCULAR,
    createdAt: Date.now(),
    createdBy: uid,
    min: GAME_PLAYERS_LIMIT.TESTEMUNHA_OCULAR.min,
    max: GAME_PLAYERS_LIMIT.TESTEMUNHA_OCULAR.max,
    isLocked: false,
    isComplete: false,
    language,
    replay: 0,
  },
  players: {},
  store: {
    pastQuestions: [],
    gameOrder: [],
    turnOrder: [],
  },
  state: {
    phase: TESTEMUNHA_OCULAR_PHASES.LOBBY,
    round: {
      current: 0,
      total: 0,
    },
  },
});

export const nextTestemunhaOcularPhase = async (
  collectionName: string,
  gameId: string,
  players: Players,
  additionalPayload?: PlainObject
): Promise<boolean> => {
  const actionText = 'prepare next phase';

  // Gather docs and references
  const sessionRef = firebaseUtils.getSessionRef(collectionName, gameId);
  const stateDoc = await firebaseUtils.getSessionDoc(collectionName, gameId, 'state', actionText);
  const storeDoc = await firebaseUtils.getSessionDoc(collectionName, gameId, 'store', actionText);

  const state = stateDoc.data() ?? {};
  const store = { ...(storeDoc.data() ?? {}) };

  // Determine next phase
  const nextPhase = determineNextPhase(
    state?.phase,
    state?.round,
    additionalPayload?.lose,
    additionalPayload?.win
  );

  // RULES -> SETUP
  if (nextPhase === TESTEMUNHA_OCULAR_PHASES.SETUP) {
    // Request data
    const additionalData = await getQuestions(store.language);
    const newPhase = await prepareSetupPhase(additionalData);
    await firebaseUtils.saveGame(sessionRef, newPhase);
    return nextTestemunhaOcularPhase(collectionName, gameId, players);
  }

  // SETUP -> WITNESS_SELECTION
  if (nextPhase === TESTEMUNHA_OCULAR_PHASES.WITNESS_SELECTION) {
    const newPhase = await prepareWitnessSelectionPhase();
    return firebaseUtils.saveGame(sessionRef, newPhase);
  }

  // * -> QUESTION_SELECTION
  if (nextPhase === TESTEMUNHA_OCULAR_PHASES.QUESTION_SELECTION) {
    const newPhase = await prepareQuestionSelectionPhase(store, state, players, additionalPayload ?? {});
    return firebaseUtils.saveGame(sessionRef, newPhase);
  }

  // QUESTION_SELECTION -> QUESTIONING
  if (nextPhase === TESTEMUNHA_OCULAR_PHASES.QUESTIONING) {
    const newPhase = await prepareQuestioningPhase(store, additionalPayload ?? {});
    return firebaseUtils.saveGame(sessionRef, newPhase);
  }

  // QUESTIONING -> TRIAL
  if (nextPhase === TESTEMUNHA_OCULAR_PHASES.TRIAL) {
    const newPhase = await prepareTrialPhase(store, state, additionalPayload ?? {});
    return firebaseUtils.saveGame(sessionRef, newPhase);
  }

  // TRIAL -> GAME_OVER
  if (nextPhase === TESTEMUNHA_OCULAR_PHASES.GAME_OVER) {
    const newPhase = await prepareGameOverPhase(store, state, additionalPayload ?? {});

    // Save usedTestemunhaOcularCards to global
    const usedTestemunhaOcularCards = buildUsedCardsIdsDict(store.pastQuestions);
    await globalUtils.updateGlobalFirebaseDoc('usedTestemunhaOcularCards', usedTestemunhaOcularCards);

    // Save testimonies to public gallery
    // TODO

    return firebaseUtils.saveGame(sessionRef, newPhase);
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

  let actionText = 'submit action';
  firebaseUtils.verifyPayload(gameId, 'gameId', actionText);
  firebaseUtils.verifyPayload(collectionName, 'collectionName', actionText);
  firebaseUtils.verifyPayload(playerId, 'playerId', actionText);
  firebaseUtils.verifyPayload(action, 'action', actionText);
  switch (action) {
    case 'SELECT_WITNESS':
      actionText = 'select witness';
      if (!data.witness) {
        firebaseUtils.throwException('Missing `witness` value', actionText);
      }
      return handleExtraAction(collectionName, gameId, actionText, { playerId, witness: data.witness });

    case 'SELECT_QUESTION':
      actionText = 'select question';
      if (!data.questionId) {
        firebaseUtils.throwException('Missing `questionId` value', actionText);
      }
      return handleExtraAction(collectionName, gameId, actionText, { playerId, questionId: data.questionId });

    case 'GIVE_TESTIMONY':
      actionText = 'give testimony';
      if (data.testimony === undefined) {
        firebaseUtils.throwException('Missing `testimony` value', actionText);
      }
      return handleExtraAction(collectionName, gameId, actionText, { playerId, testimony: data.testimony });

    case 'ELIMINATE_SUSPECT':
      actionText = 'eliminate suspect';
      if (!data.suspectId && !data.pass) {
        firebaseUtils.throwException('Missing `suspectId` value', actionText);
      }
      return handleElimination(collectionName, gameId, actionText, {
        playerId,
        suspectId: data?.suspectId,
        pass: data?.pass,
      });

    default:
      firebaseUtils.throwException(`Given action ${action} is not allowed`);
  }
};
