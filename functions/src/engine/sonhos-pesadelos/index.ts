// Constants
import { GAME_COLLECTIONS } from '../../utils/constants';
import { PLAYER_COUNTS, SONHOS_PESADELOS_ACTIONS, SONHOS_PESADELOS_PHASES, TOTAL_ROUNDS } from './constants';
// Types
import type { SonhosPesadelosInitialState, SonhosPesadelosSubmitAction } from './types';
// Utils
import * as utils from '../../utils';
import { determineNextPhase } from './helpers';
import {
  prepareGameOverPhase,
  prepareResolutionPhase,
  prepareMatchingPhase,
  prepareSetupPhase,
  prepareDreamTellingPhase,
} from './setup';
import { handleSubmitDream, handleSubmitVoting } from './actions';
import { getInspirationThemes } from './data';

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
): SonhosPesadelosInitialState => {
  return utils.helpers.getDefaultInitialState({
    gameId,
    gameName: GAME_COLLECTIONS.SONHOS_PESADELOS,
    uid,
    language,
    playerCounts: PLAYER_COUNTS,
    initialPhase: SONHOS_PESADELOS_PHASES.LOBBY,
    totalRounds: TOTAL_ROUNDS,
    store: {},
  });
};

/**
 * Exposes min and max player count
 */
export const playerCounts = PLAYER_COUNTS;

export const getNextPhase = async (
  collectionName: string,
  gameId: string,
  players: Players
): Promise<boolean> => {
  const actionText = 'prepare next phase';

  // Gather docs and references
  const { sessionRef, state, store } = await utils.firebase.getStateAndStoreReferences(
    collectionName,
    gameId,
    actionText
  );

  // Determine next phase
  const nextPhase = determineNextPhase(state?.phase, state?.round, state?.lastRound);

  // RULES -> SETUP
  if (nextPhase === SONHOS_PESADELOS_PHASES.SETUP) {
    // Enter setup phase before doing anything
    await utils.firebase.triggerSetupPhase(sessionRef);

    // Request data
    const additionalData = await getInspirationThemes(store.language);
    const newPhase = await prepareSetupPhase(store, state, players, additionalData);
    await utils.firebase.saveGame(sessionRef, newPhase);

    return getNextPhase(collectionName, gameId, newPhase.update?.players ?? {});
  }

  // * -> DREAM_TELLING
  if (nextPhase === SONHOS_PESADELOS_PHASES.DREAM_TELLING) {
    const newPhase = await prepareDreamTellingPhase(store, state, players);
    return utils.firebase.saveGame(sessionRef, newPhase);
  }

  // DREAM_TELLING -> MATCHING
  if (nextPhase === SONHOS_PESADELOS_PHASES.MATCHING) {
    const newPhase = await prepareMatchingPhase(store, state, players);
    return utils.firebase.saveGame(sessionRef, newPhase);
  }

  // MATCHING -> RESOLUTION
  if (nextPhase === SONHOS_PESADELOS_PHASES.RESOLUTION) {
    const newPhase = await prepareResolutionPhase(store, state, players);
    return utils.firebase.saveGame(sessionRef, newPhase);
  }

  // RESOLUTION --> GAME_OVER
  if (nextPhase === SONHOS_PESADELOS_PHASES.GAME_OVER) {
    const newPhase = await prepareGameOverPhase(store, state, players);
    return utils.firebase.saveGame(sessionRef, newPhase);
  }

  return true;
};

/**
 * Perform action submit by the app
 * @param data
 * @returns
 */
export const submitAction = async (data: SonhosPesadelosSubmitAction) => {
  const { gameId, gameName: collectionName, playerId, action } = data;

  utils.firebase.validateSubmitActionPayload(gameId, collectionName, playerId, action);

  switch (action) {
    case SONHOS_PESADELOS_ACTIONS.SUBMIT_DREAM:
      utils.firebase.validateSubmitActionProperties(data, ['dream'], 'submit dreams');
      return handleSubmitDream(collectionName, gameId, playerId, data.dream);
    case SONHOS_PESADELOS_ACTIONS.SUBMIT_VOTING:
      utils.firebase.validateSubmitActionProperties(data, ['votes'], 'submit votes');
      return handleSubmitVoting(collectionName, gameId, playerId, data.votes);
    default:
      utils.firebase.throwException(`Given action ${action} is not allowed`);
  }
};
