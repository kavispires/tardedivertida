// Types
import type {
  FirebaseStateData,
  FirebaseStoreData,
  VendavalDePalpiteInitialState,
  VendavalDePalpiteSubmitAction,
} from './types';
// Constants
import { GAME_NAMES } from '../../constants/games';
import {
  VENDAVAL_DE_PALPITE_PHASES,
  PLAYER_COUNTS,
  MAX_ROUNDS,
  VENDAVAL_DE_PALPITE_ACTIONS,
} from './constants';
// Services
import {
  validateSubmitActionPayload,
  validateSubmitActionProperties,
  throwHttpsError,
} from '../../services/firebase-core';
import { getStateAndStoreReferences, saveGame, triggerSetupPhase } from '../../services/game-session';
// Mechanics
import { getDefaultInitialState } from '../../mechanics/session';
// Internal
import {
  handleSubmitEvaluation,
  handleSubmitHelp,
  handleSubmitBossPlayer,
  handleSubmitOutcome,
  handleSubmitPlayerClues,
  handleSubmitSecretWord,
} from './actions';
import { getData } from './data';
import { determineNextPhase } from './helpers';
import {
  prepareClueEvaluations,
  prepareGameOverPhase,
  prepareBossPlayerSelection,
  preparePlayersClues,
  prepareSecretWordSelection,
  prepareSetupPhase,
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
  language: Language,
  version: string,
): VendavalDePalpiteInitialState => {
  return getDefaultInitialState<VendavalDePalpiteInitialState>({
    gameId,
    gameName: GAME_NAMES.VENDAVAL_DE_PALPITE,
    uid,
    language,
    version,
    playerCounts: PLAYER_COUNTS,
    totalRounds: MAX_ROUNDS,
    store: {},
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
  const nextPhase = determineNextPhase(state?.phase, state?.round, state?.outcome);

  // LOBBY -> SETUP
  if (nextPhase === VENDAVAL_DE_PALPITE_PHASES.SETUP) {
    // Enter setup phase before doing anything
    await triggerSetupPhase(sessionRef);

    // Request data
    const additionalData = await getData(store.language);
    const newPhase = await prepareSetupPhase(store, state, players, additionalData);
    await saveGame(sessionRef, newPhase);
    return getNextPhase(gameName, gameId);
  }

  // SETUP -> BOSS_SELECTION
  if (nextPhase === VENDAVAL_DE_PALPITE_PHASES.BOSS_SELECTION) {
    const newPhase = await prepareBossPlayerSelection();
    return saveGame(sessionRef, newPhase);
  }

  // BOSS_SELECTION -> SECRET_WORD_SELECTION
  if (nextPhase === VENDAVAL_DE_PALPITE_PHASES.SECRET_WORD_SELECTION) {
    const newPhase = await prepareSecretWordSelection(store, state, players);
    return saveGame(sessionRef, newPhase);
  }

  // * -> CARD_PLAY
  if (nextPhase === VENDAVAL_DE_PALPITE_PHASES.PLAYERS_CLUES) {
    const newPhase = await preparePlayersClues(store, state, players);
    return saveGame(sessionRef, newPhase);
  }

  // CARD_PLAY -> RESOLUTION
  if (nextPhase === VENDAVAL_DE_PALPITE_PHASES.CLUE_EVALUATIONS) {
    const newPhase = await prepareClueEvaluations(gameId, store, state, players);
    return saveGame(sessionRef, newPhase);
  }

  // RESOLUTION -> GAME_OVER
  if (nextPhase === VENDAVAL_DE_PALPITE_PHASES.GAME_OVER) {
    const newPhase = await prepareGameOverPhase(gameId, store, state, players);
    return saveGame(sessionRef, newPhase);
  }

  return true;
};

/**
 * Handles cards submissions
 * May trigger next phase
 */
export const submitAction = async (data: VendavalDePalpiteSubmitAction) => {
  const { gameId, gameName, playerId, action } = data;

  validateSubmitActionPayload(gameId, gameName, playerId, action);

  switch (action) {
    case VENDAVAL_DE_PALPITE_ACTIONS.SUBMIT_BOSS:
      validateSubmitActionProperties(data, ['bossId'], 'submit boss player id');
      return handleSubmitBossPlayer(gameName, gameId, playerId, data.bossId);
    case VENDAVAL_DE_PALPITE_ACTIONS.SUBMIT_SECRET_WORD:
      validateSubmitActionProperties(data, ['secretWord', 'categories'], 'submit secret word and categories');
      return handleSubmitSecretWord(gameName, gameId, playerId, data.secretWord, data.categories);
    case VENDAVAL_DE_PALPITE_ACTIONS.SUBMIT_CLUES:
      validateSubmitActionProperties(data, ['clues'], 'submit clues');
      return handleSubmitPlayerClues(gameName, gameId, playerId, data.clues, data.guesses);
    case VENDAVAL_DE_PALPITE_ACTIONS.SUBMIT_EVALUATION:
      validateSubmitActionProperties(data, ['evaluation'], 'submit evaluation');
      return handleSubmitEvaluation(gameName, gameId, playerId, data.evaluation);
    case VENDAVAL_DE_PALPITE_ACTIONS.SUBMIT_OUTCOME:
      validateSubmitActionProperties(data, ['outcome'], 'submit outcome');
      return handleSubmitOutcome(gameName, gameId, playerId, data.outcome);
    case VENDAVAL_DE_PALPITE_ACTIONS.SUBMIT_HELP:
      validateSubmitActionProperties(data, ['clueId'], 'submit help');
      return handleSubmitHelp(gameName, gameId, playerId, data.clueId);
    default:
      throwHttpsError(`Given action ${action} is not allowed`, action);
  }
};
