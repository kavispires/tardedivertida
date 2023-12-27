// Constants
import { GAME_NAMES } from '../../utils/constants';
import { MAX_ROUNDS, PLAYER_COUNTS, UE_SO_ISSO_ACTIONS, UE_SO_ISSO_PHASES } from './constants';
// Types
import type {
  FirebaseStateData,
  FirebaseStoreData,
  UeSoIssoGameOptions,
  UeSoIssoInitialState,
  UeSoIssoSubmitAction,
} from './types';
// Utilities
import utils from '../../utils';
// Internal Functions
import { determineNextPhase } from './helpers';
import { getWords } from './data';
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
import {
  handleConfirmGuess,
  handleSendGuess,
  handleSubmitSuggestions,
  handleSubmitValidation,
  handleSubmitWordSelectionVotes,
  handleUpdateValidSuggestions,
} from './actions';

/**
 * Get Initial Game State
 * @param gameId
 * @param uid
 * @param language
 * @returns
 */
export const getInitialState = (
  gameId: GameId,
  uid: string,
  language: string,
  version: string,
  options: UeSoIssoGameOptions
): UeSoIssoInitialState => {
  return utils.helpers.getDefaultInitialState<UeSoIssoInitialState>({
    gameId,
    gameName: GAME_NAMES.UE_SO_ISSO,
    uid,
    language,
    version,
    playerCounts: PLAYER_COUNTS,
    initialPhase: UE_SO_ISSO_PHASES.LOBBY,
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
 * Exposes min and max player count
 */
export const playerCounts = PLAYER_COUNTS;

/**
 * Manage phases of the game
 * @param gameName
 * @param gameId
 * @param currentState
 * @returns
 */
export const getNextPhase = async (
  gameName: string,
  gameId: string,
  currentState?: FirebaseStateData
): Promise<boolean> => {
  const { sessionRef, state, store, players } = await utils.firebase.getStateAndStoreReferences<
    FirebaseStateData,
    FirebaseStoreData
  >(gameName, gameId, 'prepare next phase', currentState);

  // Determine next phase
  const nextPhase = determineNextPhase(state?.phase, state?.round, state?.group, store?.outcome);

  // RULES -> SETUP
  if (nextPhase === UE_SO_ISSO_PHASES.SETUP) {
    // Enter setup phase before doing anything
    await utils.firebase.triggerSetupPhase(sessionRef);

    // Request data
    const additionalData = await getWords(store.language);
    const newPhase = await prepareSetupPhase(store, state, players, additionalData);
    await utils.firebase.saveGame(sessionRef, newPhase);
    return getNextPhase(gameName, gameId);
  }

  // SETUP/* -> WORD_SELECTION
  if (nextPhase === UE_SO_ISSO_PHASES.WORD_SELECTION) {
    const newPhase = await prepareWordSelectionPhase(store, state, players);
    return utils.firebase.saveGame(sessionRef, newPhase);
  }

  // WORD_SELECTION -> SUGGEST
  if (nextPhase === UE_SO_ISSO_PHASES.SUGGEST) {
    const newPhase = await prepareSuggestPhase(store, state, players);
    return utils.firebase.saveGame(sessionRef, newPhase);
  }

  // SUGGEST -> COMPARE
  if (nextPhase === UE_SO_ISSO_PHASES.COMPARE) {
    const newPhase = await prepareComparePhase(store, state, players);
    return utils.firebase.saveGame(sessionRef, newPhase);
  }

  // COMPARE -> GUESS
  if (nextPhase === UE_SO_ISSO_PHASES.GUESS) {
    const newPhase = await prepareGuessPhase(store, state, players);
    return utils.firebase.saveGame(sessionRef, newPhase);
  }

  // GUESS -> VERIFY_GUESS
  if (nextPhase === UE_SO_ISSO_PHASES.VERIFY_GUESS) {
    const newPhase = await prepareVerifyGuessPhase(store, state, players);
    return utils.firebase.saveGame(sessionRef, newPhase);
  }

  // GUESS/VERIFY_GUESS -> GUESS
  if (nextPhase === UE_SO_ISSO_PHASES.RESULT) {
    const newPhase = await prepareResultPhase(store, state, players);
    return utils.firebase.saveGame(sessionRef, newPhase);
  }

  // GUESS -> GAME_OVER
  if (nextPhase === UE_SO_ISSO_PHASES.GAME_OVER) {
    const newPhase = await prepareGameOverPhase(gameId, store, state, players);
    return utils.firebase.saveGame(sessionRef, newPhase);
  }

  return true;
};

/**
 * Handles word selection votes, suggestions, validation, and guess confirmation
 * May trigger next phase
 */
export const submitAction = async (data: UeSoIssoSubmitAction) => {
  const { gameId, gameName, playerId, action } = data;

  utils.firebase.validateSubmitActionPayload(gameId, gameName, playerId, action);

  switch (action) {
    case UE_SO_ISSO_ACTIONS.SUBMIT_VOTES:
      utils.firebase.validateSubmitActionProperties(data, ['votes'], 'submit votes');
      return handleSubmitWordSelectionVotes(gameName, gameId, playerId, data.votes);
    case UE_SO_ISSO_ACTIONS.SUBMIT_SUGGESTIONS:
      utils.firebase.validateSubmitActionProperties(data, ['suggestions'], 'submit suggestions');
      return handleSubmitSuggestions(gameName, gameId, playerId, data.suggestions);
    case UE_SO_ISSO_ACTIONS.SUBMIT_VALIDATION:
      utils.firebase.validateSubmitActionProperties(data, ['validSuggestions'], 'submit valid suggestions');
      return handleSubmitValidation(gameName, gameId, playerId, data.validSuggestions);
    case UE_SO_ISSO_ACTIONS.SUBMIT_OUTCOME:
      utils.firebase.validateSubmitActionProperties(data, ['outcome'], 'submit outcome');
      return handleConfirmGuess(gameName, gameId, playerId, data.outcome);
    case UE_SO_ISSO_ACTIONS.VALIDATE_SUGGESTION:
      utils.firebase.validateSubmitActionProperties(data, ['suggestions'], 'validate suggestions');
      return handleUpdateValidSuggestions(gameName, gameId, playerId, data.suggestions);
    case UE_SO_ISSO_ACTIONS.SEND_GUESS:
      utils.firebase.validateSubmitActionProperties(data, ['guess'], 'send guess');
      return handleSendGuess(gameName, gameId, playerId, data.guess);
    default:
      utils.firebase.throwException(`Given action ${action} is not allowed`);
  }
};
