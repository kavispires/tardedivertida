// Types
import type {
  TeoriaDeConjuntosInitialState,
  TeoriaDeConjuntosOptions,
  TeoriaDeConjuntosSubmitAction,
  FirebaseStateData,
  FirebaseStoreData,
} from './types';
// Constants
import { GAME_NAMES } from '../../constants/games';
import {
  PLAYER_COUNTS,
  MAX_ROUNDS,
  TEORIA_DE_CONJUNTOS_PHASES,
  TEORIA_DE_CONJUNTOS_ACTIONS,
} from './constants';
// Services
import {
  validateSubmitActionPayload,
  validateSubmitActionProperties,
  throwHttpsError,
} from '../../services/firebase-core';
import { getStateAndStoreReferences, saveGame, triggerSetupPhase } from '../../services/game-session';
// Mechanics
import { getPlayerCount } from '../../mechanics/players';
import { getDefaultInitialState } from '../../mechanics/session';
// Internal
import {
  handleSubmitEvaluation,
  handleSubmitEvaluationFix,
  handleSubmitItemDiagram,
  handleSubmitJudge,
} from './actions';
import { getResourceData } from './data';
import { determineNextPhase, determineOutcome } from './helpers';
import {
  prepareSetupPhase,
  prepareGameOverPhase,
  prepareJudgeSelectionPhase,
  prepareItemPlacementPhase,
  prepareEvaluationPhase,
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
  options: TeoriaDeConjuntosOptions,
): TeoriaDeConjuntosInitialState => {
  return getDefaultInitialState<TeoriaDeConjuntosInitialState>({
    gameId,
    gameName: GAME_NAMES.TEORIA_DE_CONJUNTOS,
    uid,
    language,
    version,
    playerCounts: PLAYER_COUNTS,
    totalRounds: MAX_ROUNDS,
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
  const { sessionRef, state, store, players } = await getStateAndStoreReferences<
    FirebaseStateData,
    FirebaseStoreData
  >(gameName, gameId, 'prepare next phase', currentState);

  const currentGuess = determineOutcome(state.currentGuess, players?.[state?.activePlayerId]);

  // Determine next phase
  const nextPhase = determineNextPhase(
    state.phase,
    state.round,
    currentGuess,
    state.turnOrder,
    state.activePlayerId,
  );

  // LOBBY -> SETUP
  if (nextPhase === TEORIA_DE_CONJUNTOS_PHASES.SETUP) {
    // Enter setup phase before doing anything
    await triggerSetupPhase(sessionRef);

    // Request data
    const additionalData = await getResourceData(store.language, getPlayerCount(players), store.options);

    const newPhase = await prepareSetupPhase(store, state, players, additionalData);
    await saveGame(sessionRef, newPhase);
    return getNextPhase(gameName, gameId);
  }

  // SETUP -> JUDGE_SELECTION
  if (nextPhase === TEORIA_DE_CONJUNTOS_PHASES.JUDGE_SELECTION) {
    const newPhase = await prepareJudgeSelectionPhase(store, state, players);
    return saveGame(sessionRef, newPhase);
  }

  // * -> DIAGRAM_PLACEMENT
  if (nextPhase === TEORIA_DE_CONJUNTOS_PHASES.ITEM_PLACEMENT) {
    const newPhase = await prepareItemPlacementPhase(store, state, players, currentGuess);
    return saveGame(sessionRef, newPhase);
  }

  // DIAGRAM_PLACEMENT -> EVALUATION
  if (nextPhase === TEORIA_DE_CONJUNTOS_PHASES.EVALUATION) {
    const newPhase = await prepareEvaluationPhase(store, state, players);
    return saveGame(sessionRef, newPhase);
  }

  // EVALUATION --> GAME_OVER
  if (nextPhase === TEORIA_DE_CONJUNTOS_PHASES.GAME_OVER) {
    const newPhase = await prepareGameOverPhase(gameId, store, state, players, currentGuess);
    return saveGame(sessionRef, newPhase);
  }

  return true;
};

/**
 * Handles player action submissions and routes to appropriate handlers
 * @param data - The action data containing player information and action payload
 */
export const submitAction = async (data: TeoriaDeConjuntosSubmitAction) => {
  const { gameId, gameName, playerId, action } = data;

  validateSubmitActionPayload(gameId, gameName, playerId, action);

  switch (action) {
    case TEORIA_DE_CONJUNTOS_ACTIONS.SUBMIT_JUDGE:
      validateSubmitActionProperties(data, ['judgeId'], 'submit pairs');
      return handleSubmitJudge(gameName, gameId, playerId, data.judgeId);
    case TEORIA_DE_CONJUNTOS_ACTIONS.SUBMIT_ITEM_PLACEMENT:
      validateSubmitActionProperties(data, ['itemId', 'position'], 'submit item diagram');
      return handleSubmitItemDiagram(gameName, gameId, playerId, data.itemId, data.position);
    case TEORIA_DE_CONJUNTOS_ACTIONS.SUBMIT_EVALUATION:
      validateSubmitActionProperties(data, ['evaluation'], 'submit evaluation');
      return handleSubmitEvaluation(gameName, gameId, playerId, data.evaluation);
    case TEORIA_DE_CONJUNTOS_ACTIONS.SUBMIT_EVALUATION_FIX:
      validateSubmitActionProperties(
        data,
        ['itemId', 'currentArea', 'newEvaluation'],
        'submit evaluation fix',
      );
      return handleSubmitEvaluationFix(
        gameName,
        gameId,
        playerId,
        data.itemId,
        data.currentArea,
        data.newEvaluation,
      );
    default:
      throwHttpsError(`Given action ${action} is not allowed`, action);
  }
};
