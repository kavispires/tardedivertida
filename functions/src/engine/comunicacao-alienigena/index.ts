// Constants
import { GAME_NAMES } from '../../utils/constants';
import {
  PLAYER_COUNTS,
  COMUNICACAO_ALIENIGENA_PHASES,
  COMUNICACAO_ALIENIGENA_ACTIONS,
  MAX_ROUNDS,
} from './constants';
// Types
import type {
  ComunicacaoAlienigenaInitialState,
  ComunicacaoAlienigenaOptions,
  ComunicacaoAlienigenaState,
  ComunicacaoAlienigenaStore,
  ComunicacaoAlienigenaSubmitAction,
  FirebaseStateData,
  FirebaseStoreData,
} from './types';
// Utils
import utils from '../../utils';
// Internal Functions
import { determineNextPhase } from './helpers';
import {
  handleSubmitAlien,
  handleSubmitAlienRequest,
  handleSubmitAlienResponse,
  handleSubmitHumanInquiry,
  handleSubmitOffering,
} from './actions';
import {
  prepareSetupPhase,
  prepareGameOverPhase,
  prepareAlienSelectionPhase,
  prepareHumanAskPhase,
  prepareAlienAnswerPhase,
  prepareAlienRequestPhase,
  prepareOfferingsPhase,
  prepareRevealPhase,
} from './setup';
import { getResourceData } from './data';

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
  options: ComunicacaoAlienigenaOptions
): ComunicacaoAlienigenaInitialState => {
  return utils.helpers.getDefaultInitialState<ComunicacaoAlienigenaInitialState>({
    gameId,
    gameName: GAME_NAMES.COMUNICACAO_ALIENIGENA,
    uid,
    language,
    playerCounts: PLAYER_COUNTS,
    initialPhase: COMUNICACAO_ALIENIGENA_PHASES.LOBBY,
    totalRounds: MAX_ROUNDS,
    store: {},
    options,
    onCreate: () => {
      const players: Players = {};
      if (options.botAlien) {
        utils.players.addBots(players, 1, { role: 'alien', avatarId: 'T', name: 'Alien-Bot' });
      }
      return {
        players,
      };
    },
  });
};

/**
 * Exposes min and max player count
 */
export const playerCounts = PLAYER_COUNTS;

export const getNextPhase = async (
  gameName: string,
  gameId: string,
  currentState?: FirebaseStateData
): Promise<boolean> => {
  const { sessionRef, state, store, players } = await utils.firebase.getStateAndStoreReferences<
    FirebaseStateData,
    FirebaseStoreData
  >(gameName, gameId, 'prepare next phase', currentState);

  // Determine next phase
  const nextPhase = determineNextPhase(
    state as ComunicacaoAlienigenaState,
    store as ComunicacaoAlienigenaStore
  );

  // RULES -> SETUP
  if (nextPhase === COMUNICACAO_ALIENIGENA_PHASES.SETUP) {
    // Enter setup phase before doing anything
    await utils.firebase.triggerSetupPhase(sessionRef);

    // Request data
    const additionalData = await getResourceData(
      store.language,
      Object.keys(players).length,
      (store.options ?? {}).botAlien
    );

    const newPhase = await prepareSetupPhase(store, state, players, additionalData);
    await utils.firebase.saveGame(sessionRef, newPhase);
    return getNextPhase(gameName, gameId);
  }

  // SETUP -> ALIEN_SELECTION
  if (nextPhase === COMUNICACAO_ALIENIGENA_PHASES.ALIEN_SELECTION) {
    const newPhase = await prepareAlienSelectionPhase(store, state, players);
    return utils.firebase.saveGame(sessionRef, newPhase);
  }

  // * -> HUMANS_SASK
  if (nextPhase === COMUNICACAO_ALIENIGENA_PHASES.HUMAN_ASK) {
    const newPhase = await prepareHumanAskPhase(store, state, players);
    return utils.firebase.saveGame(sessionRef, newPhase);
  }

  // HUMANS_SASK -> ALIEN_ANSWER
  if (nextPhase === COMUNICACAO_ALIENIGENA_PHASES.ALIEN_ANSWER) {
    const newPhase = await prepareAlienAnswerPhase(store, state, players);
    return utils.firebase.saveGame(sessionRef, newPhase);
  }

  // ALIEN_ANSWER -> ALIEN_REQUEST
  if (nextPhase === COMUNICACAO_ALIENIGENA_PHASES.ALIEN_REQUEST) {
    const newPhase = await prepareAlienRequestPhase(store, state, players);
    return utils.firebase.saveGame(sessionRef, newPhase);
  }

  // ALIEN_REQUEST -> OFFERINGS
  if (nextPhase === COMUNICACAO_ALIENIGENA_PHASES.OFFERINGS) {
    const newPhase = await prepareOfferingsPhase(store, state, players);
    return utils.firebase.saveGame(sessionRef, newPhase);
  }

  // OFFERINGS -> REVEAL
  if (nextPhase === COMUNICACAO_ALIENIGENA_PHASES.REVEAL) {
    const newPhase = await prepareRevealPhase(store, state, players);
    return utils.firebase.saveGame(sessionRef, newPhase);
  }

  // RESULTS --> GAME_OVER
  if (nextPhase === COMUNICACAO_ALIENIGENA_PHASES.GAME_OVER) {
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
export const submitAction = async (data: ComunicacaoAlienigenaSubmitAction) => {
  const { gameId, gameName, playerId, action } = data;

  utils.firebase.validateSubmitActionPayload(gameId, gameName, playerId, action);

  switch (action) {
    case COMUNICACAO_ALIENIGENA_ACTIONS.SUBMIT_ALIEN:
      utils.firebase.validateSubmitActionProperties(data, ['alienId'], 'submit alienId');
      return handleSubmitAlien(gameName, gameId, playerId, data.alienId);
    case COMUNICACAO_ALIENIGENA_ACTIONS.SUBMIT_HUMAN_INQUIRY:
      utils.firebase.validateSubmitActionProperties(data, ['objectsIds'], 'submit objectsIds');
      return handleSubmitHumanInquiry(gameName, gameId, playerId, data.objectsIds);
    case COMUNICACAO_ALIENIGENA_ACTIONS.SUBMIT_ALIEN_RESPONSE:
      utils.firebase.validateSubmitActionProperties(data, ['alienResponse'], 'submit alienResponse');
      return handleSubmitAlienResponse(gameName, gameId, playerId, data.alienResponse);
    case COMUNICACAO_ALIENIGENA_ACTIONS.SUBMIT_ALIEN_REQUEST:
      utils.firebase.validateSubmitActionProperties(data, ['alienRequest'], 'submit alienRequest');
      return handleSubmitAlienRequest(gameName, gameId, playerId, data.alienRequest);
    case COMUNICACAO_ALIENIGENA_ACTIONS.SUBMIT_OFFERING:
      utils.firebase.validateSubmitActionProperties(data, ['offeringId'], 'submit offeringId');
      return handleSubmitOffering(gameName, gameId, playerId, data.offeringId);
    default:
      utils.firebase.throwException(`Given action ${action} is not allowed`);
  }
};
