// Types
import type {
  MesmiceInitialState,
  MesmiceOptions,
  MesmiceSubmitAction,
  FirebaseStateData,
  FirebaseStoreData,
} from './types';
// Constants
import { GAME_NAMES } from '../../constants/games';
import { MESMICE_ACTIONS, MESMICE_PHASES, OUTCOME, PLAYER_COUNTS, TOTAL_ROUNDS } from './constants';
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
import { handleSubmitFeature, handleSubmitObject } from './actions';
import { getData } from './data';
import { determineNextPhase } from './helpers';
import {
  prepareClueWritingPhase,
  prepareGameOverPhase,
  prepareObjectFeatureEliminationPhase,
  prepareResultPhase,
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
  options: MesmiceOptions,
): MesmiceInitialState => {
  return utils.game.getDefaultInitialState<MesmiceInitialState>({
    gameId,
    gameName: GAME_NAMES.MESMICE,
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

  const playerCount = utils.players.getPlayerCount(players);

  // Determine next phase
  const nextPhase = determineNextPhase(
    state?.phase,
    state?.round,
    state?.outcome ?? OUTCOME.NEW,
    playerCount,
  );

  // LOBBY -> SETUP
  if (nextPhase === MESMICE_PHASES.SETUP) {
    // Enter setup phase before doing anything
    await triggerSetupPhase(sessionRef);

    // Request data
    const additionalData = await getData(store.language, store.options, playerCount);
    const newPhase = await prepareSetupPhase(store, state, players, additionalData);
    await saveGame(sessionRef, newPhase);
    return getNextPhase(gameName, gameId);
  }

  // * -> CLUE_WRITING
  if (nextPhase === MESMICE_PHASES.CLUE_WRITING) {
    const newPhase = await prepareClueWritingPhase(store, state, players);
    return saveGame(sessionRef, newPhase);
  }

  // * -> OBJECT_FEATURE_ELIMINATION
  if (nextPhase === MESMICE_PHASES.OBJECT_FEATURE_ELIMINATION) {
    const newPhase = await prepareObjectFeatureEliminationPhase(store, state, players);
    return saveGame(sessionRef, newPhase);
  }

  // OBJECT_FEATURE_ELIMINATION -> RESULT
  if (nextPhase === MESMICE_PHASES.RESULT) {
    const newPhase = await prepareResultPhase(store, state, players);
    return saveGame(sessionRef, newPhase);
  }

  // RESULTS -> GAME_OVER
  if (nextPhase === MESMICE_PHASES.GAME_OVER) {
    const newPhase = await prepareGameOverPhase(gameId, store, state, players);
    return saveGame(sessionRef, newPhase);
  }

  return true;
};

/**
 * Handles player action submissions and routes to appropriate handlers
 * @param data - The action data containing player information and action payload
 */
export const submitAction = async (data: MesmiceSubmitAction) => {
  const { gameId, gameName, playerId, action } = data;

  validateSubmitActionPayload(gameId, gameName, playerId, action);

  switch (action) {
    case MESMICE_ACTIONS.SUBMIT_OBJECT:
      validateSubmitActionProperties(data, ['itemId', 'clue'], 'submit object');
      return handleSubmitObject(gameName, gameId, playerId, data.itemId, data.clue);
    case MESMICE_ACTIONS.SUBMIT_OBJECT_FEATURE:
      validateSubmitActionProperties(data, ['featureId'], 'submit featureId');
      return handleSubmitFeature(gameName, gameId, playerId, data.featureId);
    default:
      throwHttpsError(`Given action ${action} is not allowed`, action);
  }
};
