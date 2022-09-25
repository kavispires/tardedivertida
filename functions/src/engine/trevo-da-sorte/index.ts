// Constants
import { GAME_COLLECTIONS } from '../../utils/constants';
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
import * as utils from '../../utils';
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
  options: TrevoDaSorteOptions
): TrevoDaSorteInitialState => {
  return utils.helpers.getDefaultInitialState({
    gameId,
    gameName: GAME_COLLECTIONS.TREVO_DA_SORTE,
    uid,
    language,
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
export const playerCounts = PLAYER_COUNTS;

export const getNextPhase = async (
  collectionName: string,
  gameId: string,
  players: Players
): Promise<boolean> => {
  // Gather docs and references
  const { sessionRef, state, store } = await utils.firebase.getStateAndStoreReferences<
    FirebaseStateData,
    FirebaseStoreData
  >(collectionName, gameId, 'prepare next phase');

  // Determine next phase
  const nextPhase = determineNextPhase(state.phase, state?.gameOrder, state?.activeCloverId);

  // RULES -> SETUP
  if (nextPhase === TREVO_DA_SORTE_PHASES.SETUP) {
    // Enter setup phase before doing anything
    await utils.firebase.triggerSetupPhase(sessionRef);

    // Request data
    const additionalData = await getWords(store.language);
    const newPhase = await prepareSetupPhase(store, state, players, additionalData);
    await utils.firebase.saveGame(sessionRef, newPhase);
    return getNextPhase(collectionName, gameId, players);
  }

  // SETUP/* -> WORD_SELECTION
  if (nextPhase === TREVO_DA_SORTE_PHASES.WORD_SELECTION) {
    const newPhase = await prepareWordSelectionPhase(store, state, players);
    return utils.firebase.saveGame(sessionRef, newPhase);
  }

  // WORD_SELECTION -> CLOVER_WRITING
  if (nextPhase === TREVO_DA_SORTE_PHASES.CLOVER_WRITING) {
    const newPhase = await prepareCloverWritingPhase(store, state, players);
    return utils.firebase.saveGame(sessionRef, newPhase);
  }

  // CLOVER_WRITING -> CLOVER_GUESSING
  if (nextPhase === TREVO_DA_SORTE_PHASES.CLOVER_GUESSING) {
    const newPhase = await prepareCloverGuessingPhase(store, state, players);
    return utils.firebase.saveGame(sessionRef, newPhase);
  }

  // CLOVER_GUESSING -> RESULTS
  if (nextPhase === TREVO_DA_SORTE_PHASES.RESULTS) {
    const newPhase = await prepareResultsPhase(store, state, players);
    return utils.firebase.saveGame(sessionRef, newPhase);
  }

  // RESULTS -> GAME_OVER
  if (nextPhase === TREVO_DA_SORTE_PHASES.GAME_OVER) {
    const newPhase = await prepareGameOverPhase(store, state, players);
    return utils.firebase.saveGame(sessionRef, newPhase);
  }

  return true;
};

/**
 * Handles word selection votes, suggestions, validation, and guess confirmation
 * May trigger next phase
 */
export const submitAction = async (data: TrevoDaSorteSubmitAction) => {
  const { gameId, gameName: collectionName, playerId, action } = data;

  utils.firebase.validateSubmitActionPayload(gameId, collectionName, playerId, action);

  switch (action) {
    case TREVO_DA_SORTE_ACTIONS.SUBMIT_BAD_WORDS:
      utils.firebase.validateSubmitActionProperties(data, ['cardsIds'], 'submit bad cards');
      return handleSubmitBadWords(collectionName, gameId, playerId, data.cardsIds);
    case TREVO_DA_SORTE_ACTIONS.SUBMIT_CLUES:
      utils.firebase.validateSubmitActionProperties(data, ['clues'], 'submit clues');
      return handleSubmitClues(collectionName, gameId, playerId, data.clues);
    case TREVO_DA_SORTE_ACTIONS.SUBMIT_GUESS:
      utils.firebase.validateSubmitActionProperties(data, ['guesses', 'activeCloverId'], 'submit guesses');
      return handleSubmitGuess(collectionName, gameId, playerId, data.guesses, data.activeCloverId);
    default:
      utils.firebase.throwException(`Given action ${action} is not allowed`);
  }
};
