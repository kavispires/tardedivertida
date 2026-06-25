// Types
import type {
  FirebaseStateData,
  FirebaseStoreData,
  SensoLiterarioInitialState,
  SensoLiterarioSubmitAction,
} from './types';
// Constants
import { GAME_NAMES } from '../../constants/games';
import { PLAYER_COUNTS, SENSO_LITERARIO_ACTIONS, SENSO_LITERARIO_PHASES, TOTAL_ROUNDS } from './constants';
// Services
import {
  validateSubmitActionPayload,
  validateSubmitActionProperties,
  throwHttpsError,
} from '../../services/firebase-core';
import { getStateAndStoreReferences, saveGame, triggerSetupPhase } from '../../services/game-session';
// Utils
import utils from '../../utils_LEGACY';
// Internal
import { handleSubmitPattern } from './actions';
import { determineNextPhase } from './helpers';
import {
  prepareSetupPhase,
  preparePatternCreationPhase,
  prepareResultPhase,
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
): SensoLiterarioInitialState => {
  return utils.game.getDefaultInitialState<SensoLiterarioInitialState>({
    gameId,
    gameName: GAME_NAMES.SENSO_LITERARIO,
    uid,
    language,
    version,
    playerCounts: PLAYER_COUNTS,
    totalRounds: TOTAL_ROUNDS,
    store: {
      deck: [],
    },
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
  const nextPhase = determineNextPhase(state?.phase, state.round);

  // LOBBY -> SETUP
  if (nextPhase === SENSO_LITERARIO_PHASES.SETUP) {
    // Enter setup phase before doing anything
    await triggerSetupPhase(sessionRef);

    const newPhase = await prepareSetupPhase(store, state, players);
    await saveGame(sessionRef, newPhase);
    return getNextPhase(gameName, gameId);
  }

  // SETUP -> PATTERN_CREATION
  if (nextPhase === SENSO_LITERARIO_PHASES.PATTERN_CREATION) {
    const newPhase = await preparePatternCreationPhase(store, state, players);
    return saveGame(sessionRef, newPhase);
  }

  // PATTERN_CREATION -> RESULT
  if (nextPhase === SENSO_LITERARIO_PHASES.RESULT) {
    const newPhase = await prepareResultPhase(store, state, players);
    return saveGame(sessionRef, newPhase);
  }

  // RESULT -> GAME_OVER
  if (nextPhase === SENSO_LITERARIO_PHASES.GAME_OVER) {
    const newPhase = await prepareGameOverPhase(gameId, store, state, players);
    return saveGame(sessionRef, newPhase);
  }

  return true;
};

/**
 * Handles pattern submission
 * May trigger next phase
 */
export const submitAction = async (data: SensoLiterarioSubmitAction) => {
  const { gameId, gameName, playerId, action } = data;

  validateSubmitActionPayload(gameId, gameName, playerId, action);

  switch (action) {
    case SENSO_LITERARIO_ACTIONS.SUBMIT_PATTERN:
      validateSubmitActionProperties(data, ['patternId'], 'submit pattern');
      return handleSubmitPattern(gameName, gameId, playerId, data.patternId);
    default:
      throwHttpsError(`Given action ${action} is not allowed`, action);
  }
};
