// Constants
import { GAME_NAMES } from '../../utils/constants';
import { PLAYER_COUNTS, SONHOS_PESADELOS_ACTIONS, SONHOS_PESADELOS_PHASES, TOTAL_ROUNDS } from './constants';
// Types
import type {
  FirebaseStateData,
  FirebaseStoreData,
  SonhosPesadelosInitialState,
  SonhosPesadelosSubmitAction,
} from './types';
// Utils
import utils from '../../utils';
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
  language: Language,
  version: string
): SonhosPesadelosInitialState => {
  return utils.helpers.getDefaultInitialState<SonhosPesadelosInitialState>({
    gameId,
    gameName: GAME_NAMES.SONHOS_PESADELOS,
    uid,
    language,
    version,
    playerCounts: PLAYER_COUNTS,
    initialPhase: SONHOS_PESADELOS_PHASES.LOBBY,
    totalRounds: TOTAL_ROUNDS,
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
  const nextPhase = determineNextPhase(state?.phase, state?.round);

  // RULES -> SETUP
  if (nextPhase === SONHOS_PESADELOS_PHASES.SETUP) {
    // Enter setup phase before doing anything
    await utils.firestore.triggerSetupPhase(sessionRef);

    // Request data
    const additionalData = await getInspirationThemes(store.language);
    const newPhase = await prepareSetupPhase(store, state, players, additionalData);
    await utils.firestore.saveGame(sessionRef, newPhase);

    return getNextPhase(gameName, gameId);
  }

  // * -> DREAM_TELLING
  if (nextPhase === SONHOS_PESADELOS_PHASES.DREAM_TELLING) {
    const newPhase = await prepareDreamTellingPhase(store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  // DREAM_TELLING -> MATCHING
  if (nextPhase === SONHOS_PESADELOS_PHASES.MATCHING) {
    const newPhase = await prepareMatchingPhase(store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  // MATCHING -> RESOLUTION
  if (nextPhase === SONHOS_PESADELOS_PHASES.RESOLUTION) {
    const newPhase = await prepareResolutionPhase(store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  // RESOLUTION --> GAME_OVER
  if (nextPhase === SONHOS_PESADELOS_PHASES.GAME_OVER) {
    const newPhase = await prepareGameOverPhase(gameId, store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  return true;
};

/**
 * Perform action submit by the app
 * @param data
 * @returns
 */
export const submitAction = async (data: SonhosPesadelosSubmitAction) => {
  const { gameId, gameName, playerId, action } = data;

  utils.firebase.validateSubmitActionPayload(gameId, gameName, playerId, action);

  switch (action) {
    case SONHOS_PESADELOS_ACTIONS.SUBMIT_DREAM:
      utils.firebase.validateSubmitActionProperties(data, ['dream'], 'submit dreams');
      return handleSubmitDream(gameName, gameId, playerId, data.dream);
    case SONHOS_PESADELOS_ACTIONS.SUBMIT_VOTING:
      utils.firebase.validateSubmitActionProperties(data, ['votes'], 'submit votes');
      return handleSubmitVoting(gameName, gameId, playerId, data.votes);
    default:
      utils.firebase.throwExceptionV2(`Given action ${action} is not allowed`, action);
  }
};
