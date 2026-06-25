// Types
import type {
  FileiraDeFatosInitialState,
  FileiraDeFatosOptions,
  FileiraDeFatosSubmitAction,
  FirebaseStateData,
  FirebaseStoreData,
} from './types';
// Constants
import { GAME_NAMES } from '../../constants/games';
import { FILEIRA_DE_FATOS_ACTIONS, FILEIRA_DE_FATOS_PHASES, PLAYER_COUNTS, MAX_ROUNDS } from './constants';
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
import { handleSubmitScenarioOrder } from './actions';
import { getScenarios } from './data';
import { determineNextPhase } from './helpers';
import {
  prepareGameOverPhase,
  prepareResultsPhase,
  prepareScenarioOrderingPhase,
  prepareSetupPhase,
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
  options: FileiraDeFatosOptions,
): FileiraDeFatosInitialState => {
  return utils.game.getDefaultInitialState<FileiraDeFatosInitialState>({
    gameId,
    gameName: GAME_NAMES.FILEIRA_DE_FATOS,
    uid,
    language,
    version,
    playerCounts: PLAYER_COUNTS,
    totalRounds: MAX_ROUNDS,
    store: {
      deck: [],
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
): Promise<boolean> => {
  const { sessionRef, state, store, players } = await getStateAndStoreReferences<
    FirebaseStateData,
    FirebaseStoreData
  >(gameName, gameId, 'prepare next phase', currentState);

  // Determine next phase
  const nextPhase = determineNextPhase(state?.phase, state?.round);

  // LOBBY -> SETUP
  if (nextPhase === FILEIRA_DE_FATOS_PHASES.SETUP) {
    // Enter setup phase before doing anything
    await triggerSetupPhase(sessionRef);

    // Request data
    const additionalData = await getScenarios(store.language, store.options);
    const newPhase = await prepareSetupPhase(store, state, players, additionalData);
    await saveGame(sessionRef, newPhase);
    return getNextPhase(gameName, gameId);
  }

  // * -> ORDERING
  if (nextPhase === FILEIRA_DE_FATOS_PHASES.ORDERING) {
    const newPhase = await prepareScenarioOrderingPhase(store, state, players);
    return saveGame(sessionRef, newPhase);
  }

  // ORDERING -> RESULTS
  if (nextPhase === FILEIRA_DE_FATOS_PHASES.RESULTS) {
    const newPhase = await prepareResultsPhase(store, state, players);
    return saveGame(sessionRef, newPhase);
  }

  // RESULTS -> GAME_OVER
  if (nextPhase === FILEIRA_DE_FATOS_PHASES.GAME_OVER) {
    const newPhase = await prepareGameOverPhase(gameId, store, state, players);
    return saveGame(sessionRef, newPhase);
  }

  return true;
};

/**
 * Handles player action submissions and routes to appropriate handlers
 * @param data - The action data containing player information and action payload
 */
export const submitAction = async (data: FileiraDeFatosSubmitAction) => {
  const { gameId, gameName, playerId, action } = data;

  validateSubmitActionPayload(gameId, gameName, playerId, action);

  switch (action) {
    case FILEIRA_DE_FATOS_ACTIONS.SUBMIT_SCENARIO_ORDER:
      validateSubmitActionProperties(data, ['order'], 'submit scenario order');
      return handleSubmitScenarioOrder(gameName, gameId, playerId, data.order);
    default:
      throwHttpsError(`Given action ${action} is not allowed`, action);
  }
};
