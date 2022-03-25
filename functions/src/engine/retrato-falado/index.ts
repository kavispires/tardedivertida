// Constants
import { GAME_COLLECTIONS } from '../../utils/constants';
import { MAX_ROUNDS, PLAYER_COUNTS, RETRATO_FALADO_PHASES } from './constants';
// Types
import { GameId, GameName, Language, Players } from '../../utils/types';
import { RetratoFaladoInitialState, RetratoFaladoSubmitAction } from './types';
// Utilities
import * as utils from '../../utils';
// Internal Functions
import { determineNextPhase } from './helpers';
import {
  prepareSetupPhase,
  prepareCompositeSketchPhase,
  prepareEvaluationPhase,
  prepareRevealPhase,
  prepareGameOverPhase,
} from './setup';
import { getMonsterCards, saveUsedCards } from './data';
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
  return utils.helpers.getDefaultInitialState({
    gameId,
    gameName: GAME_COLLECTIONS.RETRATO_FALADO,
    uid,
    language,
    playerCounts: PLAYER_COUNTS,
    initialPhase: RETRATO_FALADO_PHASES.LOBBY,
    totalRounds: MAX_ROUNDS,
    store: {
      language,
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
 * @param collectionName
 * @param gameId
 * @param players
 * @returns
 */
export const getNextPhase = async (
  collectionName: GameName,
  gameId: GameId,
  players: Players
): Promise<boolean> => {
  const { sessionRef, state, store } = await utils.firebase.getStateAndStoreReferences(
    collectionName,
    gameId,
    'prepare next phase'
  );

  // Determine next phase
  const nextPhase = determineNextPhase(state?.phase, state?.round ?? {}, state.lastRound);

  // RULES -> SETUP
  if (nextPhase === RETRATO_FALADO_PHASES.SETUP) {
    // Enter setup phase before doing anything
    await utils.firebase.triggerSetupPhase(sessionRef);

    // Request data
    const additionalData = await getMonsterCards();
    const newPhase = await prepareSetupPhase(store, state, players, additionalData);
    await utils.firebase.saveGame(sessionRef, newPhase);
    return getNextPhase(collectionName, gameId, players);
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
    const newPhase = await prepareGameOverPhase(store, state, players);
    await saveUsedCards(store.pastSketches);
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
  const { gameId, gameName: collectionName, playerId, action } = data;

  utils.firebase.validateSubmitActionPayload(gameId, collectionName, playerId, action);

  switch (action) {
    case 'SUBMIT_ORIENTATION':
      utils.firebase.validateSubmitActionProperties(data, ['orientation'], 'submit orientation');
      return handleSubmitOrientation(collectionName, gameId, playerId, data.orientation);
    case 'SUBMIT_SKETCH':
      utils.firebase.validateSubmitActionProperties(data, ['sketch'], 'submit sketch');
      return handleSubmitSketch(collectionName, gameId, playerId, data.sketch);
    case 'SUBMIT_VOTE':
      utils.firebase.validateSubmitActionProperties(data, ['vote'], 'submit vote');
      return handleSubmitVote(collectionName, gameId, playerId, data.vote);
    default:
      utils.firebase.throwException(`Given action ${action} is not allowed`);
  }
};
