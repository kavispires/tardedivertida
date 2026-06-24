// Constants
import { GAME_NAMES } from '../../utils/constants';
import { PLAYER_COUNTS, DUETOS_PHASES, DUETOS_ACTIONS, TOTAL_ROUNDS } from './constants';
// Types
import type {
  DuetosInitialState,
  DuetosOptions,
  DuetosSubmitAction,
  FirebaseStateData,
  FirebaseStoreData,
} from './types';
// Utils
import utils from '../../utils';
// Internal Functions
import { determineNextPhase } from './helpers';
import { handleSubmitPairs } from './actions';
import { prepareSetupPhase, prepareGameOverPhase, preparePairPhase, prepareResultsPhase } from './setup';
import { getResourceData } from './data';
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
  language: Language,
  version: string,
  options: DuetosOptions,
): DuetosInitialState => {
  return utils.game.getDefaultInitialState<DuetosInitialState>({
    gameId,
    gameName: GAME_NAMES.DUETOS,
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
  const { sessionRef, state, store, players } = await utils.firestore.getStateAndStoreReferences<
    FirebaseStateData,
    FirebaseStoreData
  >(gameName, gameId, 'prepare next phase', currentState);

  // Determine next phase
  const nextPhase = determineNextPhase(state.phase, state.round);

  // LOBBY -> SETUP
  if (nextPhase === DUETOS_PHASES.SETUP) {
    // Enter setup phase before doing anything
    await utils.firestore.triggerSetupPhase(sessionRef);

    // Request data
    const additionalData = await getResourceData(store.language, store.options);

    const newPhase = await prepareSetupPhase(store, state, players, additionalData);
    await utils.firestore.saveGame(sessionRef, newPhase);
    return getNextPhase(gameName, gameId);
  }

  // SETUP -> PAIRING
  if (nextPhase === DUETOS_PHASES.PAIRING) {
    const newPhase = await preparePairPhase(store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  // PAIRING -> RESULTS
  if (nextPhase === DUETOS_PHASES.RESULTS) {
    const newPhase = await prepareResultsPhase(store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  // RESULTS --> GAME_OVER
  if (nextPhase === DUETOS_PHASES.GAME_OVER) {
    const newPhase = await prepareGameOverPhase(gameId, store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  return true;
};

/**
 * Handles player action submissions and routes to appropriate handlers
 * @param data - The action data containing player information and action payload
 */
export const submitAction = async (data: DuetosSubmitAction) => {
  const { gameId, gameName, playerId, action } = data;

  validateSubmitActionPayload(gameId, gameName, playerId, action);

  switch (action) {
    case DUETOS_ACTIONS.SUBMIT_PAIRS:
      validateSubmitActionProperties(data, ['pairs'], 'submit pairs');
      return handleSubmitPairs(gameName, gameId, playerId, data.pairs);
    default:
      throwHttpsError(`Given action ${action} is not allowed`, action);
  }
};
