// Constants
import { GAME_NAMES } from '../../utils/constants';
import { MAX_ROUNDS, ONDA_TELEPATICA_ACTIONS, ONDA_TELEPATICA_PHASES, PLAYER_COUNTS } from './constants';
// Types
import type {
  FirebaseStateData,
  FirebaseStoreData,
  OndaTelepaticaInitialState,
  OndaTelepaticaOptions,
  OndaTelepaticaSubmitAction,
} from './types';
// Utils
import utils from '../../utils';
// Internal Functions
import { determineGameOver, determineNextPhase } from './helpers';
import {
  prepareDialCluePhase,
  prepareGameOverPhase,
  prepareGuessPhase,
  prepareRevealPhase,
  prepareSetupPhase,
} from './setup';
import { getCategories } from './data';
import { handleSubmitCategory, handleSubmitClue, handleSubmitGuess } from './actions';
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
  options: OndaTelepaticaOptions,
): OndaTelepaticaInitialState => {
  return utils.game.getDefaultInitialState<OndaTelepaticaInitialState>({
    gameId,
    gameName: GAME_NAMES.ONDA_TELEPATICA,
    uid,
    language,
    version,
    playerCounts: PLAYER_COUNTS,
    totalRounds: MAX_ROUNDS,
    store: {
      gameOrder: [],
      deck: [],
      deckIndex: -1,
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

  // Determine if it's game over
  const isGameOver = determineGameOver(players, store.options, state.round);
  // Determine next phase
  const nextPhase = determineNextPhase(state?.phase, state?.round, isGameOver);

  // LOBBY -> SETUP
  if (nextPhase === ONDA_TELEPATICA_PHASES.SETUP) {
    // Enter setup phase before doing anything
    await triggerSetupPhase(sessionRef);

    // Request data
    const additionalData = await getCategories(store.language);
    const newPhase = await prepareSetupPhase(store, state, players, additionalData);
    await saveGame(sessionRef, newPhase);
    return getNextPhase(gameName, gameId);
  }

  // DIAL_SIDES -> DIAL_CLUE
  if (nextPhase === ONDA_TELEPATICA_PHASES.DIAL_CLUE) {
    const newPhase = await prepareDialCluePhase(store, state, players);
    return saveGame(sessionRef, newPhase);
  }

  // DIAL_CLUE -> GUESS
  if (nextPhase === ONDA_TELEPATICA_PHASES.GUESS) {
    const newPhase = await prepareGuessPhase(store, state, players);
    return saveGame(sessionRef, newPhase);
  }

  // GUESS -> REVEAL
  if (nextPhase === ONDA_TELEPATICA_PHASES.REVEAL) {
    const newPhase = await prepareRevealPhase(store, state, players);
    return saveGame(sessionRef, newPhase);
  }

  // REVEAL -> GAME_OVER
  if (nextPhase === ONDA_TELEPATICA_PHASES.GAME_OVER) {
    const newPhase = await prepareGameOverPhase(gameId, store, state, players);

    return saveGame(sessionRef, newPhase);
  }

  return true;
};

/**
 * Handles player action submissions and routes to appropriate handlers
 * @param data - The action data containing player information and action payload
 */
export const submitAction = async (data: OndaTelepaticaSubmitAction) => {
  const { gameId, gameName, playerId, action } = data;

  validateSubmitActionPayload(gameId, gameName, playerId, action);

  switch (action) {
    case ONDA_TELEPATICA_ACTIONS.SUBMIT_CATEGORY:
      validateSubmitActionProperties(data, ['categoryId'], 'submit category');
      return handleSubmitCategory(gameName, gameId, playerId, data.categoryId);
    case ONDA_TELEPATICA_ACTIONS.SUBMIT_CLUE:
      validateSubmitActionProperties(data, ['clue'], 'submit clue');
      return handleSubmitClue(gameName, gameId, playerId, data.clue);
    case ONDA_TELEPATICA_ACTIONS.SUBMIT_GUESS:
      validateSubmitActionProperties(data, ['guess'], 'submit guess');
      return handleSubmitGuess(gameName, gameId, playerId, data.guess);
    default:
      throwHttpsError(`Given action ${action} is not allowed`, action);
  }
};
