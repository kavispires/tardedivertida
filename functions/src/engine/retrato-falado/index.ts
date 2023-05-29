// Constants
import { GAME_NAMES } from '../../utils/constants';
import { MAX_ROUNDS, PLAYER_COUNTS, RETRATO_FALADO_ACTIONS, RETRATO_FALADO_PHASES } from './constants';
// Types
import type {
  FirebaseStateData,
  FirebaseStoreData,
  RetratoFaladoInitialState,
  RetratoFaladoSubmitAction,
} from './types';
// Utilities
import utils from '../../utils';
// Internal Functions
import { determineNextPhase } from './helpers';
import {
  prepareSetupPhase,
  prepareCompositeSketchPhase,
  prepareEvaluationPhase,
  prepareRevealPhase,
  prepareGameOverPhase,
} from './setup';
import { getMonsterCards } from './data';
import { handleSubmitOrientation, handleSubmitSketch, handleSubmitVote } from './actions';

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
  language: Language
): RetratoFaladoInitialState => {
  return utils.helpers.getDefaultInitialState<RetratoFaladoInitialState>({
    gameId,
    gameName: GAME_NAMES.RETRATO_FALADO,
    uid,
    language,
    playerCounts: PLAYER_COUNTS,
    initialPhase: RETRATO_FALADO_PHASES.LOBBY,
    totalRounds: MAX_ROUNDS,
    store: {
      deck: [],
      pastSketches: [],
    },
  });
};

/**
 * Exposes min and max player count
 */
export const playerCounts = PLAYER_COUNTS;

/**
 *
 * @param gameName
 * @param gameId
 * @param players
 * @returns
 */
export const getNextPhase = async (
  gameName: GameName,
  gameId: GameId,
  currentState?: FirebaseStateData
): Promise<boolean> => {
  const { sessionRef, state, store, players } = await utils.firebase.getStateAndStoreReferences<
    FirebaseStateData,
    FirebaseStoreData
  >(gameName, gameId, 'prepare next phase', currentState);

  // Determine next phase
  const nextPhase = determineNextPhase(state?.phase, state?.round ?? {});

  // RULES -> SETUP
  if (nextPhase === RETRATO_FALADO_PHASES.SETUP) {
    // Enter setup phase before doing anything
    await utils.firebase.triggerSetupPhase(sessionRef);

    // Request data
    const additionalData = await getMonsterCards();
    const newPhase = await prepareSetupPhase(store, state, players, additionalData);
    await utils.firebase.saveGame(sessionRef, newPhase);
    return getNextPhase(gameName, gameId);
  }

  // SETUP -> COMPOSITE_SKETCH
  if (nextPhase === RETRATO_FALADO_PHASES.COMPOSITE_SKETCH) {
    const newPhase = await prepareCompositeSketchPhase(store, state, players);
    return utils.firebase.saveGame(sessionRef, newPhase);
  }

  // COMPOSITE_SKETCH -> EVALUATION
  if (nextPhase === RETRATO_FALADO_PHASES.EVALUATION) {
    const newPhase = await prepareEvaluationPhase(store, state, players);
    return utils.firebase.saveGame(sessionRef, newPhase);
  }

  // EVALUATION -> REVEAL
  if (nextPhase === RETRATO_FALADO_PHASES.REVEAL) {
    const newPhase = await prepareRevealPhase(store, state, players);
    return utils.firebase.saveGame(sessionRef, newPhase);
  }

  // REVEAL -> GAME_OVER
  if (nextPhase === RETRATO_FALADO_PHASES.GAME_OVER) {
    const newPhase = await prepareGameOverPhase(gameId, store, state, players);
    return utils.firebase.saveGame(sessionRef, newPhase);
  }

  return true;
};

/**
 * Perform action submitted by the app
 * @param data
 * @returns
 */
export const submitAction = async (data: RetratoFaladoSubmitAction) => {
  const { gameId, gameName, playerId, action } = data;

  utils.firebase.validateSubmitActionPayload(gameId, gameName, playerId, action);

  switch (action) {
    case RETRATO_FALADO_ACTIONS.SUBMIT_ORIENTATION:
      utils.firebase.validateSubmitActionProperties(data, ['orientation'], 'submit orientation');
      return handleSubmitOrientation(gameName, gameId, playerId, data.orientation);
    case RETRATO_FALADO_ACTIONS.SUBMIT_SKETCH:
      utils.firebase.validateSubmitActionProperties(data, ['sketch'], 'submit sketch');
      return handleSubmitSketch(gameName, gameId, playerId, data.sketch);
    case RETRATO_FALADO_ACTIONS.SUBMIT_VOTE:
      utils.firebase.validateSubmitActionProperties(data, ['vote'], 'submit vote');
      return handleSubmitVote(gameName, gameId, playerId, data.vote);
    default:
      utils.firebase.throwException(`Given action ${action} is not allowed`);
  }
};
