// Constants
import { GAME_NAMES } from '../../utils/constants';
import {
  CONTROLE_DE_ESTOQUE_ACTIONS,
  CONTROLE_DE_ESTOQUE_PHASES,
  PLAYER_COUNTS,
  MIN_ROUNDS,
} from './constants';
// Types
import type {
  ControleDeEstoqueInitialState,
  ControleDeEstoqueSubmitAction,
  FirebaseStateData,
  FirebaseStoreData,
} from './types';
// Utils
import utils from '../../utils';
// Internal Functions
import { determineNextPhase } from './helpers';
import {
  prepareSetupPhase,
  prepareGoodPlacementPhase,
  prepareGameOverPhase,
  preparePlacementConfirmationPhase,
  prepareFulfillmentPhase,
  prepareResultsPhase,
} from './setup';
import { getData } from './data';
import { handlePlaceGood } from './actions';
// import { handleNextEvaluationGroup, handleSubmitAnswers, handleSubmitRejectAnswers } from './actions';

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
  version: string
): ControleDeEstoqueInitialState => {
  return utils.helpers.getDefaultInitialState<ControleDeEstoqueInitialState>({
    gameId,
    gameName: GAME_NAMES.CONTROLE_DE_ESTOQUE,
    uid,
    language,
    version,
    playerCounts: PLAYER_COUNTS,
    initialPhase: CONTROLE_DE_ESTOQUE_PHASES.LOBBY,
    totalRounds: MIN_ROUNDS,
    store: {},
  });
};

/**
 * Exposes min and max player count
 */
export const getPlayerCounts = () => PLAYER_COUNTS;

export const getNextPhase = async (
  gameName: string,
  gameId: string,
  currentState?: FirebaseStateData
): Promise<boolean> => {
  const { sessionRef, state, store, players } = await utils.firestore.getStateAndStoreReferences<
    FirebaseStateData,
    FirebaseStoreData
  >(gameName, gameId, 'prepare next phase', currentState);

  // Determine next phase
  const nextPhase = determineNextPhase(state?.phase, state?.round, state);

  // RULES -> SETUP
  if (nextPhase === CONTROLE_DE_ESTOQUE_PHASES.SETUP) {
    // Enter setup phase before doing anything
    await utils.firestore.triggerSetupPhase(sessionRef);

    // Request data
    const additionalData = await getData();
    const newPhase = await prepareSetupPhase(store, state, players, additionalData);
    await utils.firestore.saveGame(sessionRef, newPhase);
    return getNextPhase(gameName, gameId);
  }

  // * -> GOOD_PLACEMENT
  if (nextPhase === CONTROLE_DE_ESTOQUE_PHASES.GOOD_PLACEMENT) {
    const newPhase = await prepareGoodPlacementPhase(store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  // GOOD_PLACEMENT -> PLACEMENT_CONFIRMATION
  if (nextPhase === CONTROLE_DE_ESTOQUE_PHASES.PLACEMENT_CONFIRMATION) {
    const newPhase = await preparePlacementConfirmationPhase(store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  // PLACEMENT_CONFIRMATION / RESULTS -> FULFILLMENT
  if (nextPhase === CONTROLE_DE_ESTOQUE_PHASES.FULFILLMENT) {
    const newPhase = await prepareFulfillmentPhase(store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  // FULFILLMENT -> RESULTS
  if (nextPhase === CONTROLE_DE_ESTOQUE_PHASES.RESULTS) {
    const newPhase = await prepareResultsPhase(store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  // RESULTS -> GAME_OVER
  if (nextPhase === CONTROLE_DE_ESTOQUE_PHASES.GAME_OVER) {
    const newPhase = await prepareGameOverPhase(gameId, store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  return true;
};

/**
 * Handles clue and guesses submissions
 * May trigger next phase
 */
export const submitAction = async (data: ControleDeEstoqueSubmitAction) => {
  const { gameId, gameName, playerId, action } = data;

  utils.firebase.validateSubmitActionPayload(gameId, gameName, playerId, action);

  switch (action) {
    case CONTROLE_DE_ESTOQUE_ACTIONS.PLACE_GOOD:
      utils.firebase.validateSubmitActionProperties(
        data,
        ['goodId', 'newWarehouseSlot'],
        'submit place good'
      );
      return handlePlaceGood(
        gameName,
        gameId,
        playerId,
        data.goodId,
        data.newWarehouseSlot,
        data.previousWarehouseSlot,
        data.concealed
      );
    // case CONTROLE_DE_ESTOQUE_ACTIONS.NEXT_EVALUATION_GROUP:
    //   return handleNextEvaluationGroup(gameName, gameId, playerId);
    // case CONTROLE_DE_ESTOQUE_ACTIONS.SUBMIT_REJECTED_ANSWERS:
    //   utils.firebase.validateSubmitActionProperties(data, ['evaluations'], 'submit evaluations');
    //   return handleSubmitRejectAnswers(gameName, gameId, playerId, data.evaluations);
    default:
      utils.firebase.throwException(`Given action ${action} is not allowed`, action);
  }
};
