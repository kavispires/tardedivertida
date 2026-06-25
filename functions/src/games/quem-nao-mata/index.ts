// Types
import type {
  QuemNaoMataInitialState,
  NaRuaDoMedoSubmitAction,
  FirebaseStateData,
  FirebaseStoreData,
} from './types';
// Constants
import { GAME_NAMES } from '../../constants/games';
import { QUEM_NAO_MATA_PHASES, PLAYER_COUNTS, MAX_ROUNDS, QUEM_NAO_MATA_ACTIONS } from './constants';
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
import { handleSubmitDecision, handleSubmitMessage, handleSubmitTarget } from './actions';
import { determineNextPhase } from './helpers';
import {
  prepareSetupPhase,
  prepareGameOverPhase,
  prepareResolutionPhase,
  prepareDuelPhase,
  prepareStandoffPhase,
  prepareTargetingPhase,
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
): QuemNaoMataInitialState => {
  return utils.game.getDefaultInitialState<QuemNaoMataInitialState>({
    gameId,
    gameName: GAME_NAMES.QUEM_NAO_MATA,
    uid,
    language,
    version,
    playerCounts: PLAYER_COUNTS,
    totalRounds: MAX_ROUNDS,
    store: {},
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
  gameId: UID,
  currentState?: FirebaseStateData,
): Promise<boolean> => {
  const { sessionRef, state, store, players } = await getStateAndStoreReferences<
    FirebaseStateData,
    FirebaseStoreData
  >(gameName, gameId, 'prepare next phase', currentState);

  // Determine next phase
  const nextPhase = determineNextPhase(state?.phase, state?.round);

  // LOBBY -> SETUP
  if (nextPhase === QUEM_NAO_MATA_PHASES.SETUP) {
    // Enter setup phase before doing anything
    await triggerSetupPhase(sessionRef);

    const newPhase = await prepareSetupPhase(store, state, players);
    await saveGame(sessionRef, newPhase);

    return getNextPhase(gameName, gameId);
  }

  // SETUP/STANDOFF/RESOLUTION -> TARGETING
  if (nextPhase === QUEM_NAO_MATA_PHASES.TARGETING) {
    const newPhase = await prepareTargetingPhase(store, state, players);
    return saveGame(sessionRef, newPhase);
  }

  // TARGETING -> STANDOFF
  if (nextPhase === QUEM_NAO_MATA_PHASES.STANDOFF) {
    const newPhase = await prepareStandoffPhase(store, state, players);
    return saveGame(sessionRef, newPhase);
  }

  // STANDOFF -> DUEL
  if (nextPhase === QUEM_NAO_MATA_PHASES.DUEL) {
    const newPhase = await prepareDuelPhase(store, state, players);
    return saveGame(sessionRef, newPhase);
  }

  // DUEL -> RESOLUTION
  if (nextPhase === QUEM_NAO_MATA_PHASES.RESOLUTION) {
    const newPhase = await prepareResolutionPhase(store, state, players);
    return saveGame(sessionRef, newPhase);
  }

  // STREET_END -> GAME_OVER
  if (nextPhase === QUEM_NAO_MATA_PHASES.GAME_OVER) {
    const newPhase = await prepareGameOverPhase(gameId, store, state, players);
    return saveGame(sessionRef, newPhase);
  }

  return true;
};

/**
 * Handles player action submissions and routes to appropriate handlers
 * @param data - The action data containing player information and action payload
 */
export const submitAction = async (data: NaRuaDoMedoSubmitAction) => {
  const { gameId, gameName, playerId, action } = data;

  validateSubmitActionPayload(gameId, gameName, playerId, action);

  switch (action) {
    case QUEM_NAO_MATA_ACTIONS.SUBMIT_TARGET:
      validateSubmitActionProperties(data, ['targetId'], 'submit target');
      return handleSubmitTarget(gameName, gameId, playerId, data.targetId);
    case QUEM_NAO_MATA_ACTIONS.SUBMIT_MESSAGE:
      validateSubmitActionProperties(data, ['targetId'], 'submit message');
      return handleSubmitMessage(gameName, gameId, playerId, data.targetId, data.recipientId);
    case QUEM_NAO_MATA_ACTIONS.SUBMIT_DECISION:
      validateSubmitActionProperties(data, ['decision'], 'submit decision');
      return handleSubmitDecision(gameName, gameId, playerId, data.decision);
    default:
      throwHttpsError(`Given action ${action} is not allowed`, action);
  }
};
