// Types
import type {
  PlanejamentoUrbanoInitialState,
  PlanejamentoUrbanoOptions,
  PlanejamentoUrbanoSubmitAction,
  FirebaseStateData,
  FirebaseStoreData,
} from './types';
// Constants
import { GAME_NAMES } from '../../constants/games';
import {
  PLANEJAMENTO_URBANO_ACTIONS,
  PLANEJAMENTO_URBANO_PHASES,
  PLAYER_COUNTS,
  TOTAL_ROUNDS,
} from './constants';
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
import { handleSubmitPlanning, handleSubmitPlacements } from './actions';
import { getLocations } from './data';
import { determineNextPhase } from './helpers';
import {
  prepareSetupPhase,
  preparePlanningPhase,
  preparePlacingPhase,
  prepareResolutionPhase,
  prepareGameOverPhase,
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
  options: PlanejamentoUrbanoOptions,
): PlanejamentoUrbanoInitialState => {
  return utils.game.getDefaultInitialState<PlanejamentoUrbanoInitialState>({
    gameId,
    gameName: GAME_NAMES.PLANEJAMENTO_URBANO,
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
  if (nextPhase === PLANEJAMENTO_URBANO_PHASES.SETUP) {
    // Enter setup phase before doing anything
    await triggerSetupPhase(sessionRef);

    // Request data
    const additionalData = await getLocations();
    const newPhase = await prepareSetupPhase(store, state, players, additionalData);
    await saveGame(sessionRef, newPhase);
    return getNextPhase(gameName, gameId);
  }

  // * -> PLANNING
  if (nextPhase === PLANEJAMENTO_URBANO_PHASES.PLANNING) {
    const newPhase = await preparePlanningPhase(store, state, players);
    return saveGame(sessionRef, newPhase);
  }

  // PLANNING -> PLACING
  if (nextPhase === PLANEJAMENTO_URBANO_PHASES.PLACING) {
    const newPhase = await preparePlacingPhase(store, state, players);
    return saveGame(sessionRef, newPhase);
  }

  // PLACING -> RESOLUTION
  if (nextPhase === PLANEJAMENTO_URBANO_PHASES.RESOLUTION) {
    const newPhase = await prepareResolutionPhase(store, state, players);
    return saveGame(sessionRef, newPhase);
  }

  // RESOLUTION -> GAME_OVER
  if (nextPhase === PLANEJAMENTO_URBANO_PHASES.GAME_OVER) {
    const newPhase = await prepareGameOverPhase(gameId, store, state, players);
    return saveGame(sessionRef, newPhase);
  }

  return true;
};

export const submitAction = async (data: PlanejamentoUrbanoSubmitAction) => {
  const { gameId, gameName, playerId, action } = data;

  validateSubmitActionPayload(gameId, gameName, playerId, action);

  switch (action) {
    case PLANEJAMENTO_URBANO_ACTIONS.SUBMIT_PLANNING:
      validateSubmitActionProperties(data, ['planning'], 'submit planning');
      return handleSubmitPlanning(gameName, gameId, playerId, data.planning);
    case PLANEJAMENTO_URBANO_ACTIONS.SUBMIT_PLACEMENTS:
      validateSubmitActionProperties(data, ['evaluations'], 'submit evaluations');
      return handleSubmitPlacements(gameName, gameId, playerId, data.evaluations);
    default:
      throwHttpsError(`Given action ${action} is not allowed`, action);
  }
};
