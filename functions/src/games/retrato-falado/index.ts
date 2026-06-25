// Types
import type {
  FirebaseStateData,
  FirebaseStoreData,
  RetratoFaladoInitialState,
  RetratoFaladoSubmitAction,
} from './types';
// Constants
import { GAME_NAMES } from '../../constants/games';
import { MAX_ROUNDS, PLAYER_COUNTS, RETRATO_FALADO_ACTIONS, RETRATO_FALADO_PHASES } from './constants';
// Services
import {
  validateSubmitActionPayload,
  validateSubmitActionProperties,
  throwHttpsError,
} from '../../services/firebase-core';
import { getStateAndStoreReferences, saveGame, triggerSetupPhase } from '../../services/game-session';
// Utils
import utils from '../../utils';
// Internal
import { handleSubmitOrientation, handleSubmitSketch, handleSubmitVote } from './actions';
import { getMonsterCards } from './data';
import { determineNextPhase } from './helpers';
import {
  prepareSetupPhase,
  prepareCompositeSketchPhase,
  prepareEvaluationPhase,
  prepareRevealPhase,
  prepareGameOverPhase,
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
): RetratoFaladoInitialState => {
  return utils.game.getDefaultInitialState<RetratoFaladoInitialState>({
    gameId,
    gameName: GAME_NAMES.RETRATO_FALADO,
    uid,
    language,
    version,
    playerCounts: PLAYER_COUNTS,
    totalRounds: MAX_ROUNDS,
    store: {
      deck: [],
      pastSketches: [],
    },
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
  gameId: UID,
  currentState?: FirebaseStateData,
): Promise<boolean> => {
  const { sessionRef, state, store, players } = await getStateAndStoreReferences<
    FirebaseStateData,
    FirebaseStoreData
  >(gameName, gameId, 'prepare next phase', currentState);

  // Determine next phase
  const nextPhase = determineNextPhase(state?.phase, state?.round ?? {});

  // LOBBY -> SETUP
  if (nextPhase === RETRATO_FALADO_PHASES.SETUP) {
    // Enter setup phase before doing anything
    await triggerSetupPhase(sessionRef);

    // Request data
    const additionalData = await getMonsterCards();
    const newPhase = await prepareSetupPhase(store, state, players, additionalData);
    await saveGame(sessionRef, newPhase);
    return getNextPhase(gameName, gameId);
  }

  // SETUP -> COMPOSITE_SKETCH
  if (nextPhase === RETRATO_FALADO_PHASES.COMPOSITE_SKETCH) {
    const newPhase = await prepareCompositeSketchPhase(store, state, players);
    return saveGame(sessionRef, newPhase);
  }

  // COMPOSITE_SKETCH -> EVALUATION
  if (nextPhase === RETRATO_FALADO_PHASES.EVALUATION) {
    const newPhase = await prepareEvaluationPhase(store, state, players);
    return saveGame(sessionRef, newPhase);
  }

  // EVALUATION -> REVEAL
  if (nextPhase === RETRATO_FALADO_PHASES.REVEAL) {
    const newPhase = await prepareRevealPhase(store, state, players);
    return saveGame(sessionRef, newPhase);
  }

  // REVEAL -> GAME_OVER
  if (nextPhase === RETRATO_FALADO_PHASES.GAME_OVER) {
    const newPhase = await prepareGameOverPhase(gameId, store, state, players);
    return saveGame(sessionRef, newPhase);
  }

  return true;
};

/**
 * Handles player action submissions and routes to appropriate handlers
 * @param data - The action data containing player information and action payload
 */
export const submitAction = async (data: RetratoFaladoSubmitAction) => {
  const { gameId, gameName, playerId, action } = data;

  validateSubmitActionPayload(gameId, gameName, playerId, action);

  switch (action) {
    case RETRATO_FALADO_ACTIONS.SUBMIT_ORIENTATION:
      validateSubmitActionProperties(data, ['orientation'], 'submit orientation');
      return handleSubmitOrientation(gameName, gameId, playerId, data.orientation);
    case RETRATO_FALADO_ACTIONS.SUBMIT_SKETCH:
      validateSubmitActionProperties(data, ['sketch'], 'submit sketch');
      return handleSubmitSketch(gameName, gameId, playerId, data.sketch);
    case RETRATO_FALADO_ACTIONS.SUBMIT_VOTE:
      validateSubmitActionProperties(data, ['vote'], 'submit vote');
      return handleSubmitVote(gameName, gameId, playerId, data.vote);
    default:
      throwHttpsError(`Given action ${action} is not allowed`, action);
  }
};
