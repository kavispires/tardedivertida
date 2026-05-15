// Constants
import { GAME_NAMES } from '../../utils/constants';
import { QUAL_QUESITO_ACTIONS, QUAL_QUESITO_PHASES, PLAYER_COUNTS, TOTAL_ROUNDS } from './constants';
// Types
import type {
  QualQuesitoInitialState,
  QualQuesitoOptions,
  QualQuesitoSubmitAction,
  FirebaseStateData,
  FirebaseStoreData,
  QualQuesitoPhase,
} from './types';
// Utils
import utils from '../../utils';
// Internal Functions
import { determineNextPhase } from './helpers';
import { getResourceData } from './data';
import {
  prepareCardPlayPhase,
  prepareCategoryCreationPhase,
  prepareGameOverPhase,
  prepareResultsPhase,
  prepareSetupPhase,
  prepareSkipAnnouncementPhase,
  prepareVerificationPhase,
} from './setup';
import { handleEvaluations, handleSkipTurn, handleSubmitCards, handleSubmitCategory } from './actions';

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
  options: QualQuesitoOptions,
): QualQuesitoInitialState => {
  return utils.game.getDefaultInitialState<QualQuesitoInitialState>({
    gameId,
    gameName: GAME_NAMES.QUAL_QUESITO,
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
  const { sessionRef, state, store, players } = await utils.firestore.getStateAndStoreReferences<
    FirebaseStateData,
    FirebaseStoreData
  >(gameName, gameId, 'prepare next phase', currentState);

  // Determine next phase
  const nextPhase = determineNextPhase(
    state?.phase as QualQuesitoPhase,
    state?.round,
    !!state?.skipTurn,
    players,
  );

  // LOBBY -> SETUP
  if (nextPhase === QUAL_QUESITO_PHASES.SETUP) {
    // Enter setup phase before doing anything
    await utils.firestore.triggerSetupPhase(sessionRef);

    // Request data
    const additionalData = await getResourceData(store.options, utils.players.getPlayerCount(players));
    const newPhase = await prepareSetupPhase(store, state, players, additionalData);
    await utils.firestore.saveGame(sessionRef, newPhase);
    return getNextPhase(gameName, gameId);
  }

  // * -> CATEGORY_CREATION
  if (nextPhase === QUAL_QUESITO_PHASES.CATEGORY_CREATION) {
    const newPhase = await prepareCategoryCreationPhase(store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  if (nextPhase === QUAL_QUESITO_PHASES.SKIP_ANNOUNCEMENT) {
    // Just update the phase to SKIP_ANNOUNCEMENT
    const newPhase = await prepareSkipAnnouncementPhase(store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  // CATEGORY_CREATION -> CARD_PLAY
  if (nextPhase === QUAL_QUESITO_PHASES.CARD_PLAY) {
    const newPhase = await prepareCardPlayPhase(store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  // CARD_PLAY -> VERIFICATION
  if (nextPhase === QUAL_QUESITO_PHASES.VERIFICATION) {
    const newPhase = await prepareVerificationPhase(store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  // VERIFICATION -> RESULTS
  if (nextPhase === QUAL_QUESITO_PHASES.RESULTS) {
    const newPhase = await prepareResultsPhase(store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  // RESULTS -> GAME_OVER
  if (nextPhase === QUAL_QUESITO_PHASES.GAME_OVER) {
    const newPhase = await prepareGameOverPhase(gameId, store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  return true;
};

/**
 * Handles game actions
 * May trigger next phase
 */
export const submitAction = async (data: QualQuesitoSubmitAction) => {
  const { gameId, gameName, playerId, action } = data;

  utils.firebase.validateSubmitActionPayload(gameId, gameName, playerId, action);

  switch (action) {
    case QUAL_QUESITO_ACTIONS.SUBMIT_CATEGORY:
      utils.firebase.validateSubmitActionProperties(data, ['category'], 'submit category');
      return handleSubmitCategory(gameName, gameId, playerId, data.category);
    case QUAL_QUESITO_ACTIONS.SKIP_TURN:
      return handleSkipTurn(gameName, gameId, playerId);
    case QUAL_QUESITO_ACTIONS.SUBMIT_CARDS:
      utils.firebase.validateSubmitActionProperties(data, ['cardsIds'], 'submit cards');
      return handleSubmitCards(gameName, gameId, playerId, data.cardsIds);
    case QUAL_QUESITO_ACTIONS.SUBMIT_EVALUATIONS:
      utils.firebase.validateSubmitActionProperties(data, ['evaluations'], 'submit evaluations');
      return handleEvaluations(gameName, gameId, playerId, data.evaluations);
    default:
      utils.firebase.throwException(`Given action ${action} is not allowed`, action);
  }
};
