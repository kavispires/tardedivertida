// Constants
import { GAME_NAMES } from '../../utils/constants';
import { PLAYER_COUNTS, SENSO_LITERARIO_ACTIONS, SENSO_LITERARIO_PHASES, TOTAL_ROUNDS } from './constants';
// Types
import type {
  FirebaseStateData,
  FirebaseStoreData,
  SensoLiterarioInitialState,
  SensoLiterarioSubmitAction,
} from './types';
// Utilities
import utils from '../../utils';
// Internal Functions
import { determineNextPhase } from './helpers';
import {
  prepareSetupPhase,
  preparePatternCreationPhase,
  prepareResultPhase,
  prepareGameOverPhase,
} from './setup';
import { handleSubmitPattern } from './actions';

/**
 * Get Initial Game State
 */
export const getInitialState = (
  gameId: UID,
  uid: string,
  language: Language,
  version: string,
): SensoLiterarioInitialState => {
  return utils.helpers.getDefaultInitialState<SensoLiterarioInitialState>({
    gameId,
    gameName: GAME_NAMES.SENSO_LITERARIO,
    uid,
    language,
    version,
    playerCounts: PLAYER_COUNTS,
    initialPhase: SENSO_LITERARIO_PHASES.LOBBY,
    totalRounds: TOTAL_ROUNDS,
    store: {
      deck: [],
    },
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
  const nextPhase = determineNextPhase(state?.phase, state.round);

  // LOBBY -> SETUP
  if (nextPhase === SENSO_LITERARIO_PHASES.SETUP) {
    // Enter setup phase before doing anything
    await utils.firestore.triggerSetupPhase(sessionRef);

    const newPhase = await prepareSetupPhase(store, state, players);
    await utils.firestore.saveGame(sessionRef, newPhase);
    return getNextPhase(gameName, gameId);
  }

  // SETUP -> PATTERN_CREATION
  if (nextPhase === SENSO_LITERARIO_PHASES.PATTERN_CREATION) {
    const newPhase = await preparePatternCreationPhase(store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  // PATTERN_CREATION -> RESULT
  if (nextPhase === SENSO_LITERARIO_PHASES.RESULT) {
    const newPhase = await prepareResultPhase(store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  // RESULT -> GAME_OVER
  if (nextPhase === SENSO_LITERARIO_PHASES.GAME_OVER) {
    const newPhase = await prepareGameOverPhase(gameId, store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  return true;
};

/**
 * Handles pattern submission
 * May trigger next phase
 */
export const submitAction = async (data: SensoLiterarioSubmitAction) => {
  const { gameId, gameName, playerId, action } = data;

  utils.firebase.validateSubmitActionPayload(gameId, gameName, playerId, action);

  switch (action) {
    case SENSO_LITERARIO_ACTIONS.SUBMIT_PATTERN:
      utils.firebase.validateSubmitActionProperties(data, ['patternId'], 'submit pattern');
      return handleSubmitPattern(gameName, gameId, playerId, data.patternId);
    default:
      utils.firebase.throwException(`Given action ${action} is not allowed`, action);
  }
};
