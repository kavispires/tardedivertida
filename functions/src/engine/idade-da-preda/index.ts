// Constants
import { GAME_NAMES } from '../../utils/constants';
import { TOTAL_ROUNDS, PLAYER_COUNTS, IDADE_DA_PREDA_PHASES, IDADE_DA_PREDA_ACTIONS } from './constants';
// Types
import type {
  FirebaseStateData,
  FirebaseStoreData,
  IdadeDaPredaInitialState,
  IdadeDaPredaOptions,
  IdadeDaPredaSubmitAction,
} from './types';
// Utils
import utils from '../../utils';
// Internal Functions
import { determineNextPhase } from './helpers';
import { getResourceData } from './data';
import {
  handleSubmitConcepts,
  handleDownvoteConcepts,
  handleSubmitName,
  handleSubmitGuesses,
} from './actions';
import {
  prepareCommunicatingThingsPhase,
  prepareConceptsRevealPhase,
  prepareCreatingConceptsPhase,
  prepareGameOverPhase,
  prepareGuessingPhase,
  prepareResultsPhase,
  prepareSetupPhase,
} from './setup';

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
  options: IdadeDaPredaOptions,
): IdadeDaPredaInitialState => {
  return utils.helpers.getDefaultInitialState<IdadeDaPredaInitialState>({
    gameId,
    gameName: GAME_NAMES.IDADE_DA_PREDA,
    uid,
    language,
    version,
    playerCounts: PLAYER_COUNTS,
    initialPhase: IDADE_DA_PREDA_PHASES.LOBBY,
    totalRounds: TOTAL_ROUNDS,
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
  const nextPhase = determineNextPhase(state?.phase, state.round);

  // LOBBY -> SETUP
  if (nextPhase === IDADE_DA_PREDA_PHASES.SETUP) {
    // Enter setup phase before doing anything
    await utils.firestore.triggerSetupPhase(sessionRef);

    // Request data
    const additionalData = await getResourceData(store.options);
    const newPhase = await prepareSetupPhase(store, state, players, additionalData);
    await utils.firestore.saveGame(sessionRef, newPhase);
    return getNextPhase(gameName, gameId);
  }

  // * -> CREATING_CONCEPTS
  if (nextPhase === IDADE_DA_PREDA_PHASES.CREATING_CONCEPTS) {
    const newPhase = await prepareCreatingConceptsPhase(store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  // CREATING_CONCEPTS -> CONCEPTS_REVEAL
  if (nextPhase === IDADE_DA_PREDA_PHASES.CONCEPTS_REVEAL) {
    const newPhase = await prepareConceptsRevealPhase(store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  // CONCEPTS_REVEAL -> COMMUNICATING_THINGS
  if (nextPhase === IDADE_DA_PREDA_PHASES.COMMUNICATING_THINGS) {
    const newPhase = await prepareCommunicatingThingsPhase(store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  // COMMUNICATING_THINGS -> GUESSING
  if (nextPhase === IDADE_DA_PREDA_PHASES.GUESSING) {
    const newPhase = await prepareGuessingPhase(store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  // RESULTS -> RESULTS
  if (nextPhase === IDADE_DA_PREDA_PHASES.RESULTS) {
    const newPhase = await prepareResultsPhase(store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  // RESULTS --> GAME_OVER
  if (nextPhase === IDADE_DA_PREDA_PHASES.GAME_OVER) {
    const newPhase = await prepareGameOverPhase(gameId, store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  return true;
};

/**
 * Perform action submitted by the app
 * @param data
 * @returns
 */
export const submitAction = async (data: IdadeDaPredaSubmitAction) => {
  const { gameId, gameName, playerId, action } = data;

  utils.firebase.validateSubmitActionPayload(gameId, gameName, playerId, action);

  switch (action) {
    case IDADE_DA_PREDA_ACTIONS.SUBMIT_CONCEPTS:
      utils.firebase.validateSubmitActionProperties(data, ['proposedConcepts'], 'submit concepts');
      return handleSubmitConcepts(gameName, gameId, playerId, data.proposedConcepts);

    case IDADE_DA_PREDA_ACTIONS.DOWNVOTE_CONCEPTS:
      utils.firebase.validateSubmitActionProperties(data, ['conceptIds'], 'downvote concepts');
      return handleDownvoteConcepts(gameName, gameId, playerId, data.conceptIds);

    case IDADE_DA_PREDA_ACTIONS.SUBMIT_NAME:
      utils.firebase.validateSubmitActionProperties(data, ['itemId', 'name', 'conceptsIds'], 'submit name');
      return handleSubmitName(gameName, gameId, playerId, data.itemId, data.name, data.conceptsIds);

    case IDADE_DA_PREDA_ACTIONS.SUBMIT_GUESSES:
      utils.firebase.validateSubmitActionProperties(data, ['guesses'], 'submit guesses');
      return handleSubmitGuesses(gameName, gameId, playerId, data.guesses, data.choseRandomly);
    default:
      utils.firebase.throwException(`Given action ${action} is not allowed`, action);
  }
};
