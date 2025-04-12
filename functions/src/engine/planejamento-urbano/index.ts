// Constants
import { GAME_NAMES } from '../../utils/constants';
import {
  PLANEJAMENTO_URBANO_ACTIONS,
  PLANEJAMENTO_URBANO_PHASES,
  PLAYER_COUNTS,
  TOTAL_ROUNDS,
} from './constants';
// Types
import type {
  PlanejamentoUrbanoInitialState,
  PlanejamentoUrbanoOptions,
  PlanejamentoUrbanoSubmitAction,
  FirebaseStateData,
  FirebaseStoreData,
} from './types';
// Utils
import utils from '../../utils';
// Internal Functions
import { determineNextPhase } from './helpers';
import {
  prepareSetupPhase,
  preparePlanningPhase,
  preparePlacingPhase,
  prepareResolutionPhase,
  prepareGameOverPhase,
} from './setup';
import { getLocations } from './data';
import { handleSubmitPlanning, handleUpdatePlacement, handleSubmitPlacements } from './actions';

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
  options: PlanejamentoUrbanoOptions,
): PlanejamentoUrbanoInitialState => {
  return utils.helpers.getDefaultInitialState<PlanejamentoUrbanoInitialState>({
    gameId,
    gameName: GAME_NAMES.PLANEJAMENTO_URBANO,
    uid,
    language,
    version,
    playerCounts: PLAYER_COUNTS,
    initialPhase: PLANEJAMENTO_URBANO_PHASES.LOBBY,
    totalRounds: TOTAL_ROUNDS,
    store: {},
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

  // Determine next phase
  const nextPhase = determineNextPhase(state?.phase, state?.round);

  // LOBBY -> SETUP
  if (nextPhase === PLANEJAMENTO_URBANO_PHASES.SETUP) {
    // Enter setup phase before doing anything
    await utils.firestore.triggerSetupPhase(sessionRef);

    // Request data
    const additionalData = await getLocations();
    const newPhase = await prepareSetupPhase(store, state, players, additionalData);
    await utils.firestore.saveGame(sessionRef, newPhase);
    return getNextPhase(gameName, gameId);
  }

  // * -> PLANNING
  if (nextPhase === PLANEJAMENTO_URBANO_PHASES.PLANNING) {
    const newPhase = await preparePlanningPhase(store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  // PLANNING -> PLACING
  if (nextPhase === PLANEJAMENTO_URBANO_PHASES.PLACING) {
    const newPhase = await preparePlacingPhase(store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  // PLACING -> RESOLUTION
  if (nextPhase === PLANEJAMENTO_URBANO_PHASES.RESOLUTION) {
    const newPhase = await prepareResolutionPhase(store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  // RESOLUTION -> GAME_OVER
  if (nextPhase === PLANEJAMENTO_URBANO_PHASES.GAME_OVER) {
    const newPhase = await prepareGameOverPhase(gameId, store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  return true;
};

export const submitAction = async (data: PlanejamentoUrbanoSubmitAction) => {
  const { gameId, gameName, playerId, action } = data;

  utils.firebase.validateSubmitActionPayload(gameId, gameName, playerId, action);

  switch (action) {
    case PLANEJAMENTO_URBANO_ACTIONS.SUBMIT_PLANNING:
      utils.firebase.validateSubmitActionProperties(data, ['planning'], 'submit planning');
      return handleSubmitPlanning(gameName, gameId, playerId, data.planning);
    case PLANEJAMENTO_URBANO_ACTIONS.UPDATE_PLACEMENT:
      utils.firebase.validateSubmitActionProperties(data, ['evaluations'], 'submit planning');
      return handleUpdatePlacement(gameName, gameId, playerId, data.evaluations);
    case PLANEJAMENTO_URBANO_ACTIONS.SUBMIT_PLACEMENTS:
      utils.firebase.validateSubmitActionProperties(data, ['evaluations'], 'submit evaluations');
      return handleSubmitPlacements(gameName, gameId, playerId, data.evaluations);
    default:
      utils.firebase.throwException(`Given action ${action} is not allowed`, action);
  }
};
