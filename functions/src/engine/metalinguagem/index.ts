// Constants
import { GAME_NAMES } from '../../utils/constants';
import { METALINGUAGEM_ACTIONS, METALINGUAGEM_PHASES, PLAYER_COUNTS, MAX_ROUNDS } from './constants';
// Types
import type {
  MetalinguagemInitialState,
  MetalinguagemOptions,
  MetalinguagemSubmitAction,
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
  prepareGuessingPhase,
  prepareResultsPhase,
  prepareSetupPhase,
  prepareWordCreationPhase,
} from './setup';
import { handleSubmitGuess, handleSubmitWord } from './actions';
import {
  validateSubmitActionPayload,
  validateSubmitActionProperties,
  throwHttpsError,
} from '../../services/firebase-core';
import { getStateAndStoreReferences, saveGame, triggerSetupPhase } from '../../services/game-session';

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
  options: MetalinguagemOptions,
): MetalinguagemInitialState => {
  return utils.game.getDefaultInitialState<MetalinguagemInitialState>({
    gameId,
    gameName: GAME_NAMES.METALINGUAGEM,
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
  const nextPhase = determineNextPhase(state?.phase, state?.round, state.wordLengths);

  // LOBBY -> SETUP
  if (nextPhase === METALINGUAGEM_PHASES.SETUP) {
    // Enter setup phase before doing anything
    await triggerSetupPhase(sessionRef);

    // Request data
    const additionalData = await getResourceData(store.options);
    const newPhase = await prepareSetupPhase(store, state, players, additionalData);
    await saveGame(sessionRef, newPhase);
    return getNextPhase(gameName, gameId);
  }

  // * -> WORD_CREATION
  if (nextPhase === METALINGUAGEM_PHASES.WORD_CREATION) {
    const newPhase = await prepareWordCreationPhase(store, state, players);
    return saveGame(sessionRef, newPhase);
  }

  // WORD_CREATION -> GUESSING
  if (nextPhase === METALINGUAGEM_PHASES.GUESSING) {
    const newPhase = await prepareGuessingPhase(store, state, players);
    return saveGame(sessionRef, newPhase);
  }

  // GUESSING -> RESULTS
  if (nextPhase === METALINGUAGEM_PHASES.RESULTS) {
    const newPhase = await prepareResultsPhase(store, state, players);
    return saveGame(sessionRef, newPhase);
  }

  // RESULTS -> GAME_OVER
  if (nextPhase === METALINGUAGEM_PHASES.GAME_OVER) {
    const newPhase = await prepareGameOverPhase(gameId, store, state, players);
    return saveGame(sessionRef, newPhase);
  }

  return true;
};

/**
 * Handles player action submissions and routes to appropriate handlers
 * @param data - The action data containing player information and action payload
 */
export const submitAction = async (data: MetalinguagemSubmitAction) => {
  const { gameId, gameName, playerId, action } = data;

  validateSubmitActionPayload(gameId, gameName, playerId, action);

  switch (action) {
    case METALINGUAGEM_ACTIONS.SUBMIT_WORD:
      validateSubmitActionProperties(data, ['names', 'indexes', 'newWord'], 'submit new word');
      return handleSubmitWord(gameName, gameId, playerId, data.names, data.indexes, data.newWord);
    case METALINGUAGEM_ACTIONS.SUBMIT_GUESS:
      validateSubmitActionProperties(data, ['guesses'], 'submit guesses');
      return handleSubmitGuess(gameName, gameId, playerId, data.guesses);
    default:
      throwHttpsError(`Given action ${action} is not allowed`, action);
  }
};
