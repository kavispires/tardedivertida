// Constants
import { GAME_NAMES } from '../../utils/constants';
import { QUEM_NAO_MATA_PHASES, PLAYER_COUNTS, MAX_ROUNDS, QUEM_NAO_MATA_ACTIONS } from './constants';
// Types
import type {
  QuemNaoMataInitialState,
  NaRuaDoMedoSubmitAction,
  FirebaseStateData,
  FirebaseStoreData,
} from './types';
// Utilities
import utils from '../../utils';
// Internal Functions
import { determineNextPhase } from './helpers';
import {
  prepareSetupPhase,
  prepareGameOverPhase,
  prepareResolutionPhase,
  prepareDuelPhase,
  prepareStandoffPhase,
  prepareTargetingPhase,
} from './setup';
import { handleSubmitDecision, handleSubmitMessage, handleSubmitTarget } from './actions';

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
): QuemNaoMataInitialState => {
  return utils.helpers.getDefaultInitialState<QuemNaoMataInitialState>({
    gameId,
    gameName: GAME_NAMES.QUEM_NAO_MATA,
    uid,
    language,
    version,
    playerCounts: PLAYER_COUNTS,
    initialPhase: QUEM_NAO_MATA_PHASES.LOBBY,
    totalRounds: MAX_ROUNDS,
    store: {},
  });
};

/**
 * Exposes min and max player count
 */
export const getPlayerCounts = () => PLAYER_COUNTS;

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
  currentState?: FirebaseStateData,
): Promise<boolean> => {
  const { sessionRef, state, store, players } = await utils.firestore.getStateAndStoreReferences<
    FirebaseStateData,
    FirebaseStoreData
  >(gameName, gameId, 'prepare next phase', currentState);

  // Determine next phase
  const nextPhase = determineNextPhase(state?.phase, state?.round);

  // RULES -> SETUP
  if (nextPhase === QUEM_NAO_MATA_PHASES.SETUP) {
    // Enter setup phase before doing anything
    await utils.firestore.triggerSetupPhase(sessionRef);

    const newPhase = await prepareSetupPhase(store, state, players);
    await utils.firestore.saveGame(sessionRef, newPhase);

    return getNextPhase(gameName, gameId);
  }

  // SETUP/STANDOFF/RESOLUTION -> TARGETING
  if (nextPhase === QUEM_NAO_MATA_PHASES.TARGETING) {
    const newPhase = await prepareTargetingPhase(store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  // TARGETING -> STANDOFF
  if (nextPhase === QUEM_NAO_MATA_PHASES.STANDOFF) {
    const newPhase = await prepareStandoffPhase(store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  // STANDOFF -> DUEL
  if (nextPhase === QUEM_NAO_MATA_PHASES.DUEL) {
    const newPhase = await prepareDuelPhase(store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  // DUEL -> RESOLUTION
  if (nextPhase === QUEM_NAO_MATA_PHASES.RESOLUTION) {
    const newPhase = await prepareResolutionPhase(store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  // STREET_END -> GAME_OVER
  if (nextPhase === QUEM_NAO_MATA_PHASES.GAME_OVER) {
    const newPhase = await prepareGameOverPhase(gameId, store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  return true;
};

/**
 * Perform action submitted by the app
 * @param data
 * @returns
 */
export const submitAction = async (data: NaRuaDoMedoSubmitAction) => {
  const { gameId, gameName, playerId, action } = data;

  utils.firebase.validateSubmitActionPayload(gameId, gameName, playerId, action);

  switch (action) {
    case QUEM_NAO_MATA_ACTIONS.SUBMIT_TARGET:
      utils.firebase.validateSubmitActionProperties(data, ['targetId'], 'submit target');
      return handleSubmitTarget(gameName, gameId, playerId, data.targetId);
    case QUEM_NAO_MATA_ACTIONS.SUBMIT_MESSAGE:
      utils.firebase.validateSubmitActionProperties(data, ['targetId'], 'submit message');
      return handleSubmitMessage(gameName, gameId, playerId, data.targetId, data.recipientId);
    case QUEM_NAO_MATA_ACTIONS.SUBMIT_DECISION:
      utils.firebase.validateSubmitActionProperties(data, ['decision'], 'submit decision');
      return handleSubmitDecision(gameName, gameId, playerId, data.decision);
    default:
      utils.firebase.throwException(`Given action ${action} is not allowed`, action);
  }
};
