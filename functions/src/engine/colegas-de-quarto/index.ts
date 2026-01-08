// Constants
import { GAME_NAMES } from '../../utils/constants';
import {
  COLEGAS_DE_QUARTO_ACTIONS,
  COLEGAS_DE_QUARTO_PHASES,
  PLAYER_COUNTS,
  TOTAL_ROUNDS,
} from './constants';
// Types
import type {
  ColegasDeQuartoInitialState,
  ColegasDeQuartoOptions,
  ColegasDeQuartoSubmitAction,
  FirebaseStateData,
  FirebaseStoreData,
} from './types';
// Utils
import utils from '../../utils';
// Internal Functions
import { determineNextPhase } from './helpers';
import {
  prepareClueWritingPhase,
  prepareGuessingPhase,
  prepareGameOverPhase,
  prepareRevealPhase,
  prepareSetupPhase,
  prepareWordsSelectionPhase,
} from './setup';
import { getWords } from './data';
import { handleSubmitClues, handleSubmitGuesses, handleSubmitWords } from './actions';

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
  language: Language,
  version: string,
  options: ColegasDeQuartoOptions,
): ColegasDeQuartoInitialState => {
  return utils.helpers.getDefaultInitialState<ColegasDeQuartoInitialState>({
    gameId,
    gameName: GAME_NAMES.COLEGAS_DE_QUARTO,
    uid,
    language,
    version,
    playerCounts: PLAYER_COUNTS,
    initialPhase: COLEGAS_DE_QUARTO_PHASES.LOBBY,
    totalRounds: TOTAL_ROUNDS,
    store: {
      deck: [],
    },
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
  currentState?: FirebaseStateData,
): Promise<boolean> => {
  const { sessionRef, state, store, players } = await utils.firestore.getStateAndStoreReferences<
    FirebaseStateData,
    FirebaseStoreData
  >(gameName, gameId, 'prepare next phase', currentState);

  // Determine next phase
  const nextPhase = determineNextPhase(state?.phase, state?.round);

  // LOBBY -> SETUP
  if (nextPhase === COLEGAS_DE_QUARTO_PHASES.SETUP) {
    // Enter setup phase before doing anything
    await utils.firestore.triggerSetupPhase(sessionRef);

    // Request data
    const additionalData = await getWords(
      store.language,
      utils.players.getPlayerCount(players),
      store.options,
    );
    const newPhase = await prepareSetupPhase(store, state, players, additionalData);
    await utils.firestore.saveGame(sessionRef, newPhase);
    return getNextPhase(gameName, gameId);
  }

  // SETUP -> WORDS_SELECTION
  if (nextPhase === COLEGAS_DE_QUARTO_PHASES.WORDS_SELECTION) {
    const newPhase = await prepareWordsSelectionPhase(store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  // * -> CLUE_WRITING
  if (nextPhase === COLEGAS_DE_QUARTO_PHASES.CLUE_WRITING) {
    const newPhase = await prepareClueWritingPhase(store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  // CLUE_WRITING -> GUESSING
  if (nextPhase === COLEGAS_DE_QUARTO_PHASES.GUESSING) {
    const newPhase = await prepareGuessingPhase(store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  // GUESSING -> REVEAL
  if (nextPhase === COLEGAS_DE_QUARTO_PHASES.REVEAL) {
    const newPhase = await prepareRevealPhase(store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  // REVEAL -> GAME_OVER
  if (nextPhase === COLEGAS_DE_QUARTO_PHASES.GAME_OVER) {
    const newPhase = await prepareGameOverPhase(gameId, store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  return true;
};

/**
 * Handles clue and guesses submissions
 * May trigger next phase
 */
export const submitAction = async (data: ColegasDeQuartoSubmitAction) => {
  const { gameId, gameName, playerId, action } = data;

  utils.firebase.validateSubmitActionPayload(gameId, gameName, playerId, action);

  switch (action) {
    case COLEGAS_DE_QUARTO_ACTIONS.SUBMIT_WORDS:
      utils.firebase.validateSubmitActionProperties(data, ['selectedWordsIds'], 'submit words');
      return handleSubmitWords(gameName, gameId, playerId, data.selectedWordsIds);
    case COLEGAS_DE_QUARTO_ACTIONS.SUBMIT_CLUES:
      utils.firebase.validateSubmitActionProperties(data, ['clues'], 'submit clues');
      return handleSubmitClues(gameName, gameId, playerId, data.clues);
    case COLEGAS_DE_QUARTO_ACTIONS.SUBMIT_GUESSES:
      utils.firebase.validateSubmitActionProperties(data, ['guesses'], 'submit guesses');
      return handleSubmitGuesses(gameName, gameId, playerId, data.guesses);
    default:
      utils.firebase.throwException(`Given action ${action} is not allowed`, action);
  }
};
