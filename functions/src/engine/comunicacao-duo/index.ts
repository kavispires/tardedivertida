// Constants
import { GAME_NAMES } from '../../utils/constants';
import { COMUNICACAO_DUO_ACTIONS, COMUNICACAO_DUO_PHASES, PLAYER_COUNTS, MAX_ROUNDS } from './constants';
// Types
import type {
  ComunicacaoDuoInitialState,
  ComunicacaoDuoOptions,
  ComunicacaoDuoSubmitAction,
  FirebaseStateData,
  FirebaseStoreData,
} from './types';
// Utils
import utils from '../../utils';
// Internal Functions
import { determineNextPhase } from './helpers';
import {
  prepareSetupPhase,
  prepareAskingForSomething,
  prepareDeliveringSomethingPhase,
  prepareVerificationPhase,
  prepareGameOverPhase,
} from './setup';
import { getDeck } from './data';
import { handleSubmitRequest, handleSubmitDelivery, handleStopDelivering } from './actions';

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
  options: ComunicacaoDuoOptions,
): ComunicacaoDuoInitialState => {
  return utils.helpers.getDefaultInitialState<ComunicacaoDuoInitialState>({
    gameId,
    gameName: GAME_NAMES.COMUNICACAO_DUO,
    uid,
    language,
    version,
    playerCounts: PLAYER_COUNTS,
    initialPhase: COMUNICACAO_DUO_PHASES.LOBBY,
    totalRounds: MAX_ROUNDS,
    store: {},
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

  // Determine next phase
  const nextPhase = determineNextPhase(state?.phase, state?.round, state.nextPhase);

  // RULES -> SETUP
  if (nextPhase === COMUNICACAO_DUO_PHASES.SETUP) {
    // Enter setup phase before doing anything
    await utils.firestore.triggerSetupPhase(sessionRef);

    // Request data
    const additionalData = await getDeck(store.options);
    const newPhase = await prepareSetupPhase(store, state, players, additionalData);
    await utils.firestore.saveGame(sessionRef, newPhase);
    return getNextPhase(gameName, gameId);
  }

  // * -> ASKING_FOR_SOMETHING
  if (nextPhase === COMUNICACAO_DUO_PHASES.ASKING_FOR_SOMETHING) {
    const newPhase = await prepareAskingForSomething(store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  // ASKING_FOR_SOMETHING -> DELIVER_SOMETHING
  if (nextPhase === COMUNICACAO_DUO_PHASES.DELIVER_SOMETHING) {
    const newPhase = await prepareDeliveringSomethingPhase(store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  // DELIVER_SOMETHING -> VERIFICATION
  if (nextPhase === COMUNICACAO_DUO_PHASES.VERIFICATION) {
    const newPhase = await prepareVerificationPhase(store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  // VERIFICATION -> GAME_OVER
  if (nextPhase === COMUNICACAO_DUO_PHASES.GAME_OVER) {
    const newPhase = await prepareGameOverPhase(gameId, store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  return true;
};

/**
 * Handles clue and guesses submissions
 * May trigger next phase
 */
export const submitAction = async (data: ComunicacaoDuoSubmitAction) => {
  const { gameId, gameName, playerId, action } = data;

  utils.firebase.validateSubmitActionPayload(gameId, gameName, playerId, action);

  switch (action) {
    case COMUNICACAO_DUO_ACTIONS.SUBMIT_REQUEST:
      utils.firebase.validateSubmitActionProperties(data, ['clue', 'clueQuantity'], 'submit clue');
      return handleSubmitRequest(gameName, gameId, playerId, data.clue, data.clueQuantity);
    case COMUNICACAO_DUO_ACTIONS.SUBMIT_DELIVERY:
      utils.firebase.validateSubmitActionProperties(data, ['delivery'], 'submit delivery');
      return handleSubmitDelivery(gameName, gameId, playerId, data.delivery);
    case COMUNICACAO_DUO_ACTIONS.STOP_DELIVERY:
      return handleStopDelivering(gameName, gameId, playerId);
    default:
      utils.firebase.throwException(`Given action ${action} is not allowed`, action);
  }
};
