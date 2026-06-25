// Types
import type {
  CorreioDoAmorInitialState,
  CorreioDoAmorOptions,
  CorreioDoAmorSubmitAction,
  FirebaseStateData,
  FirebaseStoreData,
} from './types';
// Constants
import { GAME_NAMES } from '../../constants/games';
import { CORREIO_DO_AMOR_ACTIONS, CORREIO_DO_AMOR_PHASES, PLAYER_COUNTS, MAX_ROUNDS } from './constants';
// Services
import {
  validateSubmitActionPayload,
  validateSubmitActionProperties,
  throwHttpsError,
} from '../../services/firebase-core';
import { getStateAndStoreReferences, saveGame, triggerSetupPhase } from '../../services/game-session';
// Utils
import utils from '../../utils';
// Internal
import { handleCard, handleSelections } from './actions';
import { getData } from './data';
import { determineNextPhase } from './helpers';
import {
  prepareSetupPhase,
  prepareCardPlayPhase,
  prepareCardEffectsPhase,
  prepareCardResolutionPhase,
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
  options: CorreioDoAmorOptions,
): CorreioDoAmorInitialState => {
  return utils.game.getDefaultInitialState<CorreioDoAmorInitialState>({
    gameId,
    gameName: GAME_NAMES.CORREIO_DO_AMOR,
    uid,
    language,
    version,
    playerCounts: PLAYER_COUNTS,
    totalRounds: MAX_ROUNDS,
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
 * @param currentState - Optional current state for optimization
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
  const nextPhase = determineNextPhase(state.phase, state.round);

  // LOBBY -> SETUP
  if (nextPhase === CORREIO_DO_AMOR_PHASES.SETUP) {
    // Enter setup phase before doing anything
    await triggerSetupPhase(sessionRef);

    // Request data and prepare setup phase
    const additionalData = await getData(store.language, store.options);
    const newPhase = await prepareSetupPhase(store, state, players, additionalData);
    await saveGame(sessionRef, newPhase);
    return getNextPhase(gameName, gameId);
  }

  // SETUP -> CARD_PLAY
  if (nextPhase === CORREIO_DO_AMOR_PHASES.CARD_PLAY) {
    const newPhase = await prepareCardPlayPhase(store, state, players);
    return saveGame(sessionRef, newPhase);
  }

  // CARD_PLAY -> CARD_EFFECTS
  if (nextPhase === CORREIO_DO_AMOR_PHASES.CARD_EFFECTS) {
    const newPhase = await prepareCardEffectsPhase(store, state, players);
    return saveGame(sessionRef, newPhase);
  }

  // CARD_EFFECTS -> CARD_RESOLUTION
  if (nextPhase === CORREIO_DO_AMOR_PHASES.CARD_RESOLUTION) {
    const newPhase = await prepareCardResolutionPhase(store, state, players);
    return saveGame(sessionRef, newPhase);
  }

  // CARD_RESOLUTION -> GAME_OVER
  if (nextPhase === CORREIO_DO_AMOR_PHASES.GAME_OVER) {
    const newPhase = await prepareGameOverPhase(gameId, store, state, players);
    return saveGame(sessionRef, newPhase);
  }

  return true;
};

/**
 * Handles player action submissions and routes to appropriate handlers
 * @param data - The action data containing player information and action payload
 */
export const submitAction = async (data: CorreioDoAmorSubmitAction) => {
  const { gameId, gameName, playerId, action } = data;

  validateSubmitActionPayload(gameId, gameName, playerId, action);

  switch (action) {
    case CORREIO_DO_AMOR_ACTIONS.SUBMIT_CARD:
      validateSubmitActionProperties(data, ['payload'], 'card play submission');
      return handleCard(gameName, gameId, playerId, data.payload);
    case CORREIO_DO_AMOR_ACTIONS.SUBMIT_SELECTIONS:
      validateSubmitActionProperties(data, ['selections'], 'selections submission');
      return handleSelections(gameName, gameId, playerId, data.selections);
    default:
      throwHttpsError(`Given action ${action} is not allowed`, action);
  }
};
