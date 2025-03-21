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
  options: MetalinguagemOptions,
): MetalinguagemInitialState => {
  return utils.helpers.getDefaultInitialState<MetalinguagemInitialState>({
    gameId,
    gameName: GAME_NAMES.METALINGUAGEM,
    uid,
    language,
    version,
    playerCounts: PLAYER_COUNTS,
    initialPhase: METALINGUAGEM_PHASES.LOBBY,
    totalRounds: MAX_ROUNDS,
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
  currentState?: FirebaseStateData,
): Promise<boolean> => {
  const { sessionRef, state, store, players } = await utils.firestore.getStateAndStoreReferences<
    FirebaseStateData,
    FirebaseStoreData
  >(gameName, gameId, 'prepare next phase', currentState);

  // Determine next phase
  const nextPhase = determineNextPhase(state?.phase, state?.round, state.wordLengths);

  // RULES -> SETUP
  if (nextPhase === METALINGUAGEM_PHASES.SETUP) {
    // Enter setup phase before doing anything
    await utils.firestore.triggerSetupPhase(sessionRef);

    // Request data
    const additionalData = await getResourceData(store.options);
    const newPhase = await prepareSetupPhase(store, state, players, additionalData);
    await utils.firestore.saveGame(sessionRef, newPhase);
    return getNextPhase(gameName, gameId);
  }

  // * -> WORD_CREATION
  if (nextPhase === METALINGUAGEM_PHASES.WORD_CREATION) {
    const newPhase = await prepareWordCreationPhase(store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  // WORD_CREATION -> GUESSING
  if (nextPhase === METALINGUAGEM_PHASES.GUESSING) {
    const newPhase = await prepareGuessingPhase(store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  // GUESSING -> RESULTS
  if (nextPhase === METALINGUAGEM_PHASES.RESULTS) {
    const newPhase = await prepareResultsPhase(store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  // RESULTS -> GAME_OVER
  if (nextPhase === METALINGUAGEM_PHASES.GAME_OVER) {
    const newPhase = await prepareGameOverPhase(gameId, store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  return true;
};

/**
 * Handles guesses submissions
 * May trigger next phase
 */
export const submitAction = async (data: MetalinguagemSubmitAction) => {
  const { gameId, gameName, playerId, action } = data;

  utils.firebase.validateSubmitActionPayload(gameId, gameName, playerId, action);

  switch (action) {
    case METALINGUAGEM_ACTIONS.SUBMIT_WORD:
      utils.firebase.validateSubmitActionProperties(data, ['names', 'indexes', 'newWord'], 'submit new word');
      return handleSubmitWord(gameName, gameId, playerId, data.names, data.indexes, data.newWord);
    case METALINGUAGEM_ACTIONS.SUBMIT_GUESS:
      utils.firebase.validateSubmitActionProperties(data, ['guesses'], 'submit guesses');
      return handleSubmitGuess(gameName, gameId, playerId, data.guesses);
    default:
      utils.firebase.throwException(`Given action ${action} is not allowed`, action);
  }
};
