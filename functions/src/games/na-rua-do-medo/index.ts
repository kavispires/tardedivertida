// Types
import type {
  NoRuaDoMedoInitialState,
  NoRuaDoMedoOptions,
  NaRuaDoMedoSubmitAction,
  FirebaseStateData,
  FirebaseStoreData,
} from './types';
// Constants
import { GAME_NAMES } from '../../constants/games';
import { NA_RUA_DO_MEDO_PHASES, PLAYER_COUNTS, MAX_ROUNDS, NA_RUA_DO_MEDO_ACTIONS } from './constants';
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
import { handleSubmitDecision } from './actions';
import { determineOutcome, determineNextPhase } from './helpers';
import {
  prepareSetupPhase,
  prepareTrickOrTreatPhase,
  prepareResultPhase,
  prepareStreetEndPhase,
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
  options: NoRuaDoMedoOptions,
): NoRuaDoMedoInitialState => {
  return utils.game.getDefaultInitialState<NoRuaDoMedoInitialState>({
    gameId,
    gameName: GAME_NAMES.NA_RUA_DO_MEDO,
    uid,
    language,
    version,
    playerCounts: PLAYER_COUNTS,
    totalRounds: MAX_ROUNDS,
    store: {
      horrorDeck: [],
      jackpotDeck: [],
      candyDeck: [],
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
  gameId: UID,
  currentState?: FirebaseStateData,
): Promise<boolean> => {
  const { sessionRef, state, store, players } = await getStateAndStoreReferences<
    FirebaseStateData,
    FirebaseStoreData
  >(gameName, gameId, 'prepare next phase', currentState);

  // Determine if it's game over
  const outcome = determineOutcome(store, state, players);
  // Determine next phase
  const nextPhase = determineNextPhase(state?.phase, state?.round, outcome);
  // LOBBY -> SETUP
  if (nextPhase === NA_RUA_DO_MEDO_PHASES.SETUP) {
    // Enter setup phase before doing anything
    await triggerSetupPhase(sessionRef);

    const newPhase = await prepareSetupPhase(store, state, players);
    await saveGame(sessionRef, newPhase);
    return getNextPhase(gameName, gameId);
  }

  // * -> TRICK_OR_TREAT
  if (nextPhase === NA_RUA_DO_MEDO_PHASES.TRICK_OR_TREAT) {
    const newPhase = await prepareTrickOrTreatPhase(store, state, players, outcome);
    return saveGame(sessionRef, newPhase);
  }

  // TRICK_OR_TREAT -> RESULT
  if (nextPhase === NA_RUA_DO_MEDO_PHASES.RESULT) {
    const newPhase = await prepareResultPhase(store, state, players);
    return saveGame(sessionRef, newPhase);
  }

  // TRICK_OR_TREAT -> STREET_END
  if (nextPhase === NA_RUA_DO_MEDO_PHASES.STREET_END) {
    const newPhase = await prepareStreetEndPhase(store, state, players, outcome);
    return saveGame(sessionRef, newPhase);
  }

  // STREET_END -> GAME_OVER
  if (nextPhase === NA_RUA_DO_MEDO_PHASES.GAME_OVER) {
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
    case NA_RUA_DO_MEDO_ACTIONS.SUBMIT_DECISION:
      validateSubmitActionProperties(data, ['decision'], 'submit decision');
      return handleSubmitDecision(gameName, gameId, playerId, data.decision);
    default:
      throwHttpsError(`Given action ${action} is not allowed`, action);
  }
};
