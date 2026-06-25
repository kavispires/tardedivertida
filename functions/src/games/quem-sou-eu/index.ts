// Types
import type {
  FirebaseStateData,
  FirebaseStoreData,
  QuemSouEuInitialState,
  QuemSouEuOptions,
  QuemSouEuSubmitAction,
} from './types';
// Constants
import { GAME_NAMES } from '../../constants/games';
import { TOTAL_ROUNDS, PLAYER_COUNTS, QUEM_SOU_EU_PHASES, QUEM_SOU_EU_ACTIONS } from './constants';
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
import { handleSubmitCharacters, handleSubmitGlyphs, handleSubmitGuesses } from './actions';
import { getResourceData } from './data';
import { determineNextPhase } from './helpers';
import {
  prepareSetupPhase,
  prepareCharacterFilteringPhase,
  prepareCharacterDescriptionPhase,
  prepareGuessingPhase,
  prepareResultsPhase,
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
  options: QuemSouEuOptions,
): QuemSouEuInitialState => {
  return utils.game.getDefaultInitialState<QuemSouEuInitialState>({
    gameId,
    gameName: GAME_NAMES.QUEM_SOU_EU,
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
  const nextPhase = determineNextPhase(state?.phase, state.round, !!store.options?.imageCardsMode);

  // LOBBY -> SETUP
  if (nextPhase === QUEM_SOU_EU_PHASES.SETUP) {
    // Enter setup phase before doing anything
    await triggerSetupPhase(sessionRef);

    // Request data
    const additionalData = await getResourceData(
      store.language,
      utils.players.getPlayerCount(players),
      store.options,
    );
    const newPhase = await prepareSetupPhase(store, state, players, additionalData);
    await saveGame(sessionRef, newPhase);
    return getNextPhase(gameName, gameId);
  }

  // SETUP -> CHARACTER_FILTERING
  if (nextPhase === QUEM_SOU_EU_PHASES.CHARACTER_FILTERING) {
    const newPhase = await prepareCharacterFilteringPhase(store, state, players);
    return saveGame(sessionRef, newPhase);
  }

  // * -> CHARACTER_DESCRIPTION
  if (nextPhase === QUEM_SOU_EU_PHASES.CHARACTER_DESCRIPTION) {
    const newPhase = await prepareCharacterDescriptionPhase(store, state, players);
    return saveGame(sessionRef, newPhase);
  }

  // CHARACTER_DESCRIPTION -> GUESSING
  if (nextPhase === QUEM_SOU_EU_PHASES.GUESSING) {
    const newPhase = await prepareGuessingPhase(store, state, players);
    return saveGame(sessionRef, newPhase);
  }

  // GUESSING -> RESULTS
  if (nextPhase === QUEM_SOU_EU_PHASES.RESULTS) {
    const newPhase = await prepareResultsPhase(store, state, players);
    return saveGame(sessionRef, newPhase);
  }

  // RESULTS --> GAME_OVER
  if (nextPhase === QUEM_SOU_EU_PHASES.GAME_OVER) {
    const newPhase = await prepareGameOverPhase(gameId, store, state, players);
    return saveGame(sessionRef, newPhase);
  }

  return true;
};

/**
 * Handles player action submissions and routes to appropriate handlers
 * @param data - The action data containing player information and action payload
 */
export const submitAction = async (data: QuemSouEuSubmitAction) => {
  const { gameId, gameName, playerId, action } = data;

  validateSubmitActionPayload(gameId, gameName, playerId, action);

  switch (action) {
    case QUEM_SOU_EU_ACTIONS.SUBMIT_CHARACTERS:
      validateSubmitActionProperties(data, ['characters'], 'submit characters');
      return handleSubmitCharacters(gameName, gameId, playerId, data.characters);
    case QUEM_SOU_EU_ACTIONS.SUBMIT_GLYPHS:
      validateSubmitActionProperties(data, ['glyphs'], 'submit glyphs');
      return handleSubmitGlyphs(gameName, gameId, playerId, data.glyphs);
    case QUEM_SOU_EU_ACTIONS.SUBMIT_GUESSES:
      validateSubmitActionProperties(data, ['guesses'], 'submit guesses');
      return handleSubmitGuesses(gameName, gameId, playerId, data.guesses, data.choseRandomly);
    default:
      throwHttpsError(`Given action ${action} is not allowed`, action);
  }
};
