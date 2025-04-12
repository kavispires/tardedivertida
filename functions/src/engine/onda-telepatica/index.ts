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
  options: OndaTelepaticaOptions,
): OndaTelepaticaInitialState => {
  return utils.helpers.getDefaultInitialState<OndaTelepaticaInitialState>({
    gameId,
    gameName: GAME_NAMES.ONDA_TELEPATICA,
    uid,
    language,
    version,
    playerCounts: PLAYER_COUNTS,
    initialPhase: ONDA_TELEPATICA_PHASES.LOBBY,
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

  // Determine if it's game over
  const isGameOver = determineGameOver(players, store.options, state.round);
  // Determine next phase
  const nextPhase = determineNextPhase(state?.phase, state?.round, isGameOver);

  // LOBBY -> SETUP
  if (nextPhase === ONDA_TELEPATICA_PHASES.SETUP) {
    // Enter setup phase before doing anything
    await utils.firestore.triggerSetupPhase(sessionRef);

    // Request data
    const additionalData = await getCategories(store.language);
    const newPhase = await prepareSetupPhase(store, state, players, additionalData);
    await utils.firestore.saveGame(sessionRef, newPhase);
    return getNextPhase(gameName, gameId);
  }

  // DIAL_SIDES -> DIAL_CLUE
  if (nextPhase === ONDA_TELEPATICA_PHASES.DIAL_CLUE) {
    const newPhase = await prepareDialCluePhase(store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  // DIAL_CLUE -> GUESS
  if (nextPhase === ONDA_TELEPATICA_PHASES.GUESS) {
    const newPhase = await prepareGuessPhase(store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  // GUESS -> REVEAL
  if (nextPhase === ONDA_TELEPATICA_PHASES.REVEAL) {
    const newPhase = await prepareRevealPhase(store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  // REVEAL -> GAME_OVER
  if (nextPhase === ONDA_TELEPATICA_PHASES.GAME_OVER) {
    const newPhase = await prepareGameOverPhase(gameId, store, state, players);

    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  return true;
};

/**
 * Handles categories and guesses submissions
 * May trigger next phase
 */
export const submitAction = async (data: OndaTelepaticaSubmitAction) => {
  const { gameId, gameName, playerId, action } = data;

  utils.firebase.validateSubmitActionPayload(gameId, gameName, playerId, action);

  switch (action) {
    case ONDA_TELEPATICA_ACTIONS.SUBMIT_CATEGORY:
      utils.firebase.validateSubmitActionProperties(data, ['categoryId'], 'submit category');
      return handleSubmitCategory(gameName, gameId, playerId, data.categoryId);
    case ONDA_TELEPATICA_ACTIONS.SUBMIT_CLUE:
      utils.firebase.validateSubmitActionProperties(data, ['clue'], 'submit clue');
      return handleSubmitClue(gameName, gameId, playerId, data.clue);
    case ONDA_TELEPATICA_ACTIONS.SUBMIT_GUESS:
      utils.firebase.validateSubmitActionProperties(data, ['guess'], 'submit guess');
      return handleSubmitGuess(gameName, gameId, playerId, data.guess);
    default:
      utils.firebase.throwException(`Given action ${action} is not allowed`, action);
  }
};
