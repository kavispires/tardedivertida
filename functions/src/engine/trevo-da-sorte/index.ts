// Constants
import { GAME_NAMES } from '../../utils/constants';
import { PLAYER_COUNTS, TREVO_DA_SORTE_ACTIONS, TREVO_DA_SORTE_PHASES } from './constants';
// Types
import {
  FirebaseStateData,
  FirebaseStoreData,
  TrevoDaSorteInitialState,
  TrevoDaSorteOptions,
  TrevoDaSorteSubmitAction,
} from './types';
// Utilities
import utils from '../../utils';
// Internal Functions
import { determineNextPhase } from './helpers';
import { getWords } from './data';
import {
  prepareSetupPhase,
  prepareWordSelectionPhase,
  prepareCloverWritingPhase,
  prepareCloverGuessingPhase,
  prepareResultsPhase,
  prepareGameOverPhase,
} from './setup';
import { handleSubmitClues, handleSubmitBadWords, handleSubmitGuess } from './actions';

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
  options: TrevoDaSorteOptions
): TrevoDaSorteInitialState => {
  return utils.helpers.getDefaultInitialState<TrevoDaSorteInitialState>({
    gameId,
    gameName: GAME_NAMES.TREVO_DA_SORTE,
    uid,
    language,
    version,
    playerCounts: PLAYER_COUNTS,
    initialPhase: TREVO_DA_SORTE_PHASES.LOBBY,
    totalRounds: 0,
    store: {},
    options,
  });
};

/**
 * Exposes min and max player count
 */
export const getPlayerCounts = () => PLAYER_COUNTS;

export const getNextPhase = async (
  gameName: string,
  gameId: string,
  currentState?: FirebaseStateData
): Promise<boolean> => {
  const { sessionRef, state, store, players } = await utils.firestore.getStateAndStoreReferences<
    FirebaseStateData,
    FirebaseStoreData
  >(gameName, gameId, 'prepare next phase', currentState);

  // Determine next phase
  const nextPhase = determineNextPhase(state.phase, state?.gameOrder, state?.activeCloverId);

  // RULES -> SETUP
  if (nextPhase === TREVO_DA_SORTE_PHASES.SETUP) {
    // Enter setup phase before doing anything
    await utils.firestore.triggerSetupPhase(sessionRef);

    // Request data
    const additionalData = await getWords(store.language);
    const newPhase = await prepareSetupPhase(store, state, players, additionalData);
    await utils.firestore.saveGame(sessionRef, newPhase);
    return getNextPhase(gameName, gameId);
  }

  // SETUP/* -> WORD_SELECTION
  if (nextPhase === TREVO_DA_SORTE_PHASES.WORD_SELECTION) {
    const newPhase = await prepareWordSelectionPhase(store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  // WORD_SELECTION -> CLOVER_WRITING
  if (nextPhase === TREVO_DA_SORTE_PHASES.CLOVER_WRITING) {
    const newPhase = await prepareCloverWritingPhase(store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  // CLOVER_WRITING -> CLOVER_GUESSING
  if (nextPhase === TREVO_DA_SORTE_PHASES.CLOVER_GUESSING) {
    const newPhase = await prepareCloverGuessingPhase(store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  // CLOVER_GUESSING -> RESULTS
  if (nextPhase === TREVO_DA_SORTE_PHASES.RESULTS) {
    const newPhase = await prepareResultsPhase(store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  // RESULTS -> GAME_OVER
  if (nextPhase === TREVO_DA_SORTE_PHASES.GAME_OVER) {
    const newPhase = await prepareGameOverPhase(gameId, store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  return true;
};

/**
 * Handles word selection votes, suggestions, validation, and guess confirmation
 * May trigger next phase
 */
export const submitAction = async (data: TrevoDaSorteSubmitAction) => {
  const { gameId, gameName, playerId, action } = data;

  utils.firebase.validateSubmitActionPayload(gameId, gameName, playerId, action);

  switch (action) {
    case TREVO_DA_SORTE_ACTIONS.SUBMIT_BAD_WORDS:
      utils.firebase.validateSubmitActionProperties(data, ['cardsIds'], 'submit bad cards');
      return handleSubmitBadWords(gameName, gameId, playerId, data.cardsIds);
    case TREVO_DA_SORTE_ACTIONS.SUBMIT_CLUES:
      utils.firebase.validateSubmitActionProperties(data, ['clues'], 'submit clues');
      return handleSubmitClues(gameName, gameId, playerId, data.clues);
    case TREVO_DA_SORTE_ACTIONS.SUBMIT_GUESS:
      utils.firebase.validateSubmitActionProperties(data, ['guesses', 'activeCloverId'], 'submit guesses');
      return handleSubmitGuess(gameName, gameId, playerId, data.guesses, data.activeCloverId);
    default:
      utils.firebase.throwExceptionV2(`Given action ${action} is not allowed`, action);
  }
};
