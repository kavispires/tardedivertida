// Constants
import { GAME_NAMES } from '../../utils/constants';
import {
  MEDIDAS_NAO_EXATAS_ACTIONS,
  MEDIDAS_NAO_EXATAS_PHASES,
  PLAYER_COUNTS,
  TOTAL_ROUNDS,
} from './constants';
// Types
import type {
  MedidasNaoExatasInitialState,
  MedidasNaoExatasSubmitAction,
  FirebaseStateData,
  FirebaseStoreData,
} from './types';
// Utils
import utils from '../../utils';
// Internal Functions
import { determineNextPhase } from './helpers';
import { getResourceData } from './data';
import {
  prepareGameOverPhase,
  prepareMetricsBuildingPhase,
  prepareGuessingPhase,
  prepareResultsPhase,
  prepareSetupPhase,
} from './setup';
import { handleSubmitGuess, handleSubmitMetrics, handleSubmitPool } from './actions';

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
  // options: MedidasNaoExatasOptions,
): MedidasNaoExatasInitialState => {
  return utils.helpers.getDefaultInitialState<MedidasNaoExatasInitialState>({
    gameId,
    gameName: GAME_NAMES.MEDIDAS_NAO_EXATAS,
    uid,
    language,
    version,
    playerCounts: PLAYER_COUNTS,
    initialPhase: MEDIDAS_NAO_EXATAS_PHASES.LOBBY,
    totalRounds: TOTAL_ROUNDS,
    store: {},
    // options,
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

  // Determine next phase
  const nextPhase = determineNextPhase(state?.phase, state?.round);

  // LOBBY -> SETUP
  if (nextPhase === MEDIDAS_NAO_EXATAS_PHASES.SETUP) {
    // Enter setup phase before doing anything
    await utils.firestore.triggerSetupPhase(sessionRef);

    // Request data
    const additionalData = await getResourceData(store.language);
    const newPhase = await prepareSetupPhase(store, state, players, additionalData);
    await utils.firestore.saveGame(sessionRef, newPhase);
    return getNextPhase(gameName, gameId);
  }

  // * -> METRICS_BUILDING
  if (nextPhase === MEDIDAS_NAO_EXATAS_PHASES.METRICS_BUILDING) {
    const newPhase = await prepareMetricsBuildingPhase(store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  // METRICS_BUILDING -> GUESSING
  if (nextPhase === MEDIDAS_NAO_EXATAS_PHASES.GUESSING) {
    const newPhase = await prepareGuessingPhase(store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  // GUESSING -> RESULTS
  if (nextPhase === MEDIDAS_NAO_EXATAS_PHASES.RESULTS) {
    const newPhase = await prepareResultsPhase(store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  // RESULTS -> GAME_OVER
  if (nextPhase === MEDIDAS_NAO_EXATAS_PHASES.GAME_OVER) {
    const newPhase = await prepareGameOverPhase(gameId, store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  return true;
};

/**
 * Handles game actions
 * May trigger next phase
 */
export const submitAction = async (data: MedidasNaoExatasSubmitAction) => {
  const { gameId, gameName, playerId, action } = data;

  utils.firebase.validateSubmitActionPayload(gameId, gameName, playerId, action);

  switch (action) {
    case MEDIDAS_NAO_EXATAS_ACTIONS.SUBMIT_POOL:
      utils.firebase.validateSubmitActionProperties(
        data,
        ['poolIds', 'secretWordId'],
        'submit pool of words',
      );
      return handleSubmitPool(gameName, gameId, playerId, data.poolIds, data.secretWordId);
    case MEDIDAS_NAO_EXATAS_ACTIONS.SUBMIT_METRICS:
      utils.firebase.validateSubmitActionProperties(data, ['metrics'], 'submit metrics');
      return handleSubmitMetrics(gameName, gameId, playerId, data.metrics);
    case MEDIDAS_NAO_EXATAS_ACTIONS.SUBMIT_GUESS:
      utils.firebase.validateSubmitActionProperties(data, ['guesses'], 'submit guesses');
      return handleSubmitGuess(gameName, gameId, playerId, data.guesses);
    default:
      utils.firebase.throwException(`Given action ${action} is not allowed`, action);
  }
};
