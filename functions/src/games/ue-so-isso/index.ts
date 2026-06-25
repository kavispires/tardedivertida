// Types
import type {
  FirebaseStateData,
  FirebaseStoreData,
  UeSoIssoGameOptions,
  UeSoIssoInitialState,
  UeSoIssoSubmitAction,
} from './types';
// Constants
import { GAME_NAMES } from '../../constants/games';
import { MAX_ROUNDS, PLAYER_COUNTS, UE_SO_ISSO_ACTIONS, UE_SO_ISSO_PHASES } from './constants';
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
import {
  handleConfirmGuess,
  handleSendGuess,
  handleSubmitSuggestions,
  handleSubmitValidation,
  handleSubmitWordSelectionVotes,
  handleUpdateValidSuggestions,
} from './actions';
import { getWords } from './data';
import { determineNextPhase } from './helpers';
import {
  prepareComparePhase,
  prepareGuessPhase,
  prepareSetupPhase,
  prepareSuggestPhase,
  prepareWordSelectionPhase,
  prepareGameOverPhase,
  prepareResultPhase,
  prepareVerifyGuessPhase,
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
  language: string,
  version: string,
  options: UeSoIssoGameOptions,
): UeSoIssoInitialState => {
  // If the game has hints enabled, time is mandatory.
  if (options.withHints) {
    options.withTimer = true;
  }

  return utils.game.getDefaultInitialState<UeSoIssoInitialState>({
    gameId,
    gameName: GAME_NAMES.UE_SO_ISSO,
    uid,
    language,
    version,
    playerCounts: PLAYER_COUNTS,
    totalRounds: MAX_ROUNDS,
    store: {
      deck: [],
      turnOrder: [],
      gameOrder: [],
      usedWords: {},
      currentWords: [],
      currentSuggestions: [],
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
  const nextPhase = determineNextPhase(state?.phase, state?.round, state?.group, store?.outcome);

  // LOBBY -> SETUP
  if (nextPhase === UE_SO_ISSO_PHASES.SETUP) {
    // Enter setup phase before doing anything
    await triggerSetupPhase(sessionRef);

    // Request data
    const additionalData = await getWords(store.language);
    const newPhase = await prepareSetupPhase(store, state, players, additionalData);
    await saveGame(sessionRef, newPhase);
    return getNextPhase(gameName, gameId);
  }

  // SETUP/* -> WORD_SELECTION
  if (nextPhase === UE_SO_ISSO_PHASES.WORD_SELECTION) {
    const newPhase = await prepareWordSelectionPhase(store, state, players);
    return saveGame(sessionRef, newPhase);
  }

  // WORD_SELECTION -> SUGGEST
  if (nextPhase === UE_SO_ISSO_PHASES.SUGGEST) {
    const newPhase = await prepareSuggestPhase(store, state, players);
    return saveGame(sessionRef, newPhase);
  }

  // SUGGEST -> COMPARE
  if (nextPhase === UE_SO_ISSO_PHASES.COMPARE) {
    const newPhase = await prepareComparePhase(store, state, players);
    return saveGame(sessionRef, newPhase);
  }

  // COMPARE -> GUESS
  if (nextPhase === UE_SO_ISSO_PHASES.GUESS) {
    const newPhase = await prepareGuessPhase(store, state, players);
    return saveGame(sessionRef, newPhase);
  }

  // GUESS -> VERIFY_GUESS
  if (nextPhase === UE_SO_ISSO_PHASES.VERIFY_GUESS) {
    const newPhase = await prepareVerifyGuessPhase(store, state, players);
    return saveGame(sessionRef, newPhase);
  }

  // GUESS/VERIFY_GUESS -> GUESS
  if (nextPhase === UE_SO_ISSO_PHASES.RESULT) {
    const newPhase = await prepareResultPhase(store, state, players);
    return saveGame(sessionRef, newPhase);
  }

  // GUESS -> GAME_OVER
  if (nextPhase === UE_SO_ISSO_PHASES.GAME_OVER) {
    const newPhase = await prepareGameOverPhase(gameId, store, state, players);
    return saveGame(sessionRef, newPhase);
  }

  return true;
};

/**
 * Handles word selection votes, suggestions, validation, and guess confirmation
 * May trigger next phase
 */
export const submitAction = async (data: UeSoIssoSubmitAction) => {
  const { gameId, gameName, playerId, action } = data;

  validateSubmitActionPayload(gameId, gameName, playerId, action);

  switch (action) {
    case UE_SO_ISSO_ACTIONS.SUBMIT_VOTES:
      validateSubmitActionProperties(data, ['votes'], 'submit votes');
      return handleSubmitWordSelectionVotes(gameName, gameId, playerId, data.votes);
    case UE_SO_ISSO_ACTIONS.SUBMIT_SUGGESTIONS:
      validateSubmitActionProperties(data, ['suggestions'], 'submit suggestions');
      return handleSubmitSuggestions(gameName, gameId, playerId, data.suggestions);
    case UE_SO_ISSO_ACTIONS.SUBMIT_VALIDATION:
      validateSubmitActionProperties(data, ['validSuggestions'], 'submit valid suggestions');
      return handleSubmitValidation(gameName, gameId, playerId, data.validSuggestions);
    case UE_SO_ISSO_ACTIONS.SUBMIT_OUTCOME:
      validateSubmitActionProperties(data, ['outcome'], 'submit outcome');
      return handleConfirmGuess(gameName, gameId, playerId, data.outcome);
    case UE_SO_ISSO_ACTIONS.VALIDATE_SUGGESTION:
      validateSubmitActionProperties(data, ['suggestions'], 'validate suggestions');
      return handleUpdateValidSuggestions(gameName, gameId, playerId, data.suggestions);
    case UE_SO_ISSO_ACTIONS.SEND_GUESS:
      validateSubmitActionProperties(data, ['guess'], 'send guess');
      return handleSendGuess(gameName, gameId, playerId, data.guess);
    default:
      throwHttpsError(`Given action ${action} is not allowed`, action);
  }
};
