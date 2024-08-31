// Constants
import { GAME_NAMES } from '../../utils/constants';
import { MESMICE_ACTIONS, MESMICE_PHASES, OUTCOME, PLAYER_COUNTS, TOTAL_ROUNDS } from './constants';
// Types
import type {
  MesmiceInitialState,
  MesmiceOptions,
  MesmiceSubmitAction,
  FirebaseStateData,
  FirebaseStoreData,
} from './types';
// Utils
import utils from '../../utils';
// Internal Functions
import { determineNextPhase } from './helpers';
import {
  prepareClueWritingPhase,
  prepareGameOverPhase,
  prepareObjectFeatureEliminationPhase,
  prepareResultPhase,
  prepareSetupPhase,
} from './setup';
import { getData } from './data';
import { handleSubmitFeature, handleSubmitObject } from './actions';

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
  options: MesmiceOptions
): MesmiceInitialState => {
  return utils.helpers.getDefaultInitialState<MesmiceInitialState>({
    gameId,
    gameName: GAME_NAMES.MESMICE,
    uid,
    language,
    version,
    playerCounts: PLAYER_COUNTS,
    initialPhase: MESMICE_PHASES.LOBBY,
    totalRounds: TOTAL_ROUNDS,
    store: {},
    options,
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
  const { sessionRef, state, store, players } = await utils.firestore.getStateAndStoreReferences<
    FirebaseStateData,
    FirebaseStoreData
  >(gameName, gameId, 'prepare next phase', currentState);

  const playerCount = utils.players.getPlayerCount(players);

  // Determine next phase
  const nextPhase = determineNextPhase(
    state?.phase,
    state?.round,
    state?.outcome ?? OUTCOME.NEW,
    playerCount
  );

  // RULES -> SETUP
  if (nextPhase === MESMICE_PHASES.SETUP) {
    // Enter setup phase before doing anything
    await utils.firestore.triggerSetupPhase(sessionRef);

    // Request data
    const additionalData = await getData(store.language, store.options, playerCount);
    const newPhase = await prepareSetupPhase(store, state, players, additionalData);
    await utils.firestore.saveGame(sessionRef, newPhase);
    return getNextPhase(gameName, gameId);
  }

  // * -> CLUE_WRITING
  if (nextPhase === MESMICE_PHASES.CLUE_WRITING) {
    const newPhase = await prepareClueWritingPhase(store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  // * -> OBJECT_FEATURE_ELIMINATION
  if (nextPhase === MESMICE_PHASES.OBJECT_FEATURE_ELIMINATION) {
    const newPhase = await prepareObjectFeatureEliminationPhase(store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  // OBJECT_FEATURE_ELIMINATION -> RESULT
  if (nextPhase === MESMICE_PHASES.RESULT) {
    const newPhase = await prepareResultPhase(store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  // RESULTS -> GAME_OVER
  if (nextPhase === MESMICE_PHASES.GAME_OVER) {
    const newPhase = await prepareGameOverPhase(gameId, store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  return true;
};

/**
 * Handles clue and guesses submissions
 * May trigger next phase
 */
export const submitAction = async (data: MesmiceSubmitAction) => {
  const { gameId, gameName, playerId, action } = data;

  utils.firebase.validateSubmitActionPayload(gameId, gameName, playerId, action);

  switch (action) {
    case MESMICE_ACTIONS.SUBMIT_OBJECT:
      utils.firebase.validateSubmitActionProperties(data, ['itemId', 'clue'], 'submit object');
      return handleSubmitObject(gameName, gameId, playerId, data.itemId, data.clue);
    case MESMICE_ACTIONS.SUBMIT_OBJECT_FEATURE:
      utils.firebase.validateSubmitActionProperties(data, ['featureId'], 'submit featureId');
      return handleSubmitFeature(gameName, gameId, playerId, data.featureId);
    default:
      utils.firestore.throwException(`Given action ${action} is not allowed`);
  }
};
