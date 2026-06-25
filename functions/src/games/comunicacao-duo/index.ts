// Types
import type {
  ComunicacaoDuoInitialState,
  ComunicacaoDuoOptions,
  ComunicacaoDuoSubmitAction,
  FirebaseStateData,
  FirebaseStoreData,
} from './types';
// Constants
import { GAME_NAMES } from '../../constants/games';
import { COMUNICACAO_DUO_ACTIONS, COMUNICACAO_DUO_PHASES, PLAYER_COUNTS, MAX_ROUNDS } from './constants';
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
import { handleSubmitRequest, handleSubmitDelivery, handleStopDelivering } from './actions';
import { getDeck } from './data';
import { determineNextPhase } from './helpers';
import {
  prepareSetupPhase,
  prepareAskingForSomething,
  prepareDeliveringSomethingPhase,
  prepareVerificationPhase,
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
  options: ComunicacaoDuoOptions,
): ComunicacaoDuoInitialState => {
  return utils.game.getDefaultInitialState<ComunicacaoDuoInitialState>({
    gameId,
    gameName: GAME_NAMES.COMUNICACAO_DUO,
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

  // Determine next phase
  const nextPhase = determineNextPhase(state?.phase, state?.round, state.nextPhase);

  // LOBBY -> SETUP
  if (nextPhase === COMUNICACAO_DUO_PHASES.SETUP) {
    // Enter setup phase before doing anything
    await triggerSetupPhase(sessionRef);

    // Request data
    const additionalData = await getDeck(store.language, store.options);
    const newPhase = await prepareSetupPhase(store, state, players, additionalData);
    await saveGame(sessionRef, newPhase);
    return getNextPhase(gameName, gameId);
  }

  // * -> ASKING_FOR_SOMETHING
  if (nextPhase === COMUNICACAO_DUO_PHASES.ASKING_FOR_SOMETHING) {
    const newPhase = await prepareAskingForSomething(store, state, players);
    return saveGame(sessionRef, newPhase);
  }

  // ASKING_FOR_SOMETHING -> DELIVER_SOMETHING
  if (nextPhase === COMUNICACAO_DUO_PHASES.DELIVER_SOMETHING) {
    const newPhase = await prepareDeliveringSomethingPhase(store, state, players);
    return saveGame(sessionRef, newPhase);
  }

  // DELIVER_SOMETHING -> VERIFICATION
  if (nextPhase === COMUNICACAO_DUO_PHASES.VERIFICATION) {
    const newPhase = await prepareVerificationPhase(store, state, players);
    return saveGame(sessionRef, newPhase);
  }

  // VERIFICATION -> GAME_OVER
  if (nextPhase === COMUNICACAO_DUO_PHASES.GAME_OVER) {
    const newPhase = await prepareGameOverPhase(gameId, store, state, players);
    return saveGame(sessionRef, newPhase);
  }

  return true;
};

/**
 * Handles player action submissions and routes to appropriate handlers
 * @param data - The action data containing player information and action payload
 */
export const submitAction = async (data: ComunicacaoDuoSubmitAction) => {
  const { gameId, gameName, playerId, action } = data;

  validateSubmitActionPayload(gameId, gameName, playerId, action);

  switch (action) {
    case COMUNICACAO_DUO_ACTIONS.SUBMIT_REQUEST:
      validateSubmitActionProperties(data, ['clue', 'clueQuantity'], 'submit clue');
      return handleSubmitRequest(gameName, gameId, playerId, data.clue, data.clueQuantity);
    case COMUNICACAO_DUO_ACTIONS.SUBMIT_DELIVERY:
      validateSubmitActionProperties(data, ['delivery'], 'submit delivery');
      return handleSubmitDelivery(gameName, gameId, playerId, data.delivery);
    case COMUNICACAO_DUO_ACTIONS.STOP_DELIVERY:
      return handleStopDelivering(gameName, gameId, playerId);
    default:
      throwHttpsError(`Given action ${action} is not allowed`, action);
  }
};
