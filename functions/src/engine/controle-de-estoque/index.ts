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
  prepareTheWarehousePhase,
  prepareGoodPlacementPhase,
  prepareGameOverPhase,
  prepareFulfillmentPhase,
  prepareResultsPhase,
} from './setup';
import { getData } from './data';
import { handleConfirmGood, handleFulfillOrders, handlePlaceGood } from './actions';
import { FULFILLMENT_MOCK } from './mock';

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
): ControleDeEstoqueInitialState => {
  return utils.game.getDefaultInitialState<ControleDeEstoqueInitialState>({
    gameId,
    gameName: GAME_NAMES.CONTROLE_DE_ESTOQUE,
    uid,
    language,
    version,
    playerCounts: PLAYER_COUNTS,
    totalRounds: MIN_ROUNDS,
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
  const { sessionRef, state, store, players } = await utils.firestore.getStateAndStoreReferences<
    FirebaseStateData,
    FirebaseStoreData
  >(gameName, gameId, 'prepare next phase', currentState);

  // Determine next phase
  const nextPhase = determineNextPhase(state?.phase, state?.round, state);

  // LOBBY -> SETUP
  if (nextPhase === CONTROLE_DE_ESTOQUE_PHASES.SETUP) {
    // Enter setup phase before doing anything
    await utils.firestore.triggerSetupPhase(sessionRef);

    // TODO: Remove temporary
    if (utils.firebase.isEmulatingEnvironment()) {
      const MOCK_PLAYERS = FULFILLMENT_MOCK.players as unknown as Players;

      const achievements = utils.achievements.setup(MOCK_PLAYERS, {
        attempts: 0,
        correctAtOnce: 0,
        skips: 0,
        outOfStock: 0,
        outOfStockFulfillment: 0,
      });

      await utils.firestore.saveGame(sessionRef, {
        update: {
          store: {
            achievements,
          },
        },
        set: {
          state: FULFILLMENT_MOCK,
        },
      });
      return true;
    }

    // Request data
    const additionalData = await getData();
    const newPhase = await prepareSetupPhase(store, state, players, additionalData);
    await utils.firestore.saveGame(sessionRef, newPhase);
    return getNextPhase(gameName, gameId);
  }

  // SETUP -> THE_WAREHOUSE
  if (nextPhase === CONTROLE_DE_ESTOQUE_PHASES.THE_WAREHOUSE) {
    const newPhase = await prepareTheWarehousePhase(store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  // THE_WAREHOUSE -> GOOD_PLACEMENT
  if (nextPhase === CONTROLE_DE_ESTOQUE_PHASES.GOOD_PLACEMENT) {
    const newPhase = await prepareGoodPlacementPhase(store, state, players);
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
 * Handles player action submissions and routes to appropriate handlers
 * @param data - The action data containing player information and action payload
 */
export const submitAction = async (data: ControleDeEstoqueSubmitAction) => {
  const { gameId, gameName, playerId, action } = data;

  utils.firebase.validateSubmitActionPayload(gameId, gameName, playerId, action);

  switch (action) {
    case CONTROLE_DE_ESTOQUE_ACTIONS.PLACE_GOOD:
      utils.firebase.validateSubmitActionProperties(data, ['selectedWarehouseSlot'], 'submit place good');
      return handlePlaceGood(gameName, gameId, playerId, data.selectedWarehouseSlot);
    case CONTROLE_DE_ESTOQUE_ACTIONS.CONFIRM_PLACEMENT:
      utils.firebase.validateSubmitActionProperties(data, ['selectedWarehouseSlot'], 'confirm placement');
      return handleConfirmGood(gameName, gameId, playerId, data.selectedWarehouseSlot);
    case CONTROLE_DE_ESTOQUE_ACTIONS.SUBMIT_FULFILL_ORDERS:
      utils.firebase.validateSubmitActionProperties(data, ['fulfillments'], 'submit fulfill order');
      return handleFulfillOrders(gameName, gameId, playerId, data.fulfillments);
    default:
      utils.firebase.throwException(`Given action ${action} is not allowed`, action);
  }
};
