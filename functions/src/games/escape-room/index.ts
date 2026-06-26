// Types
import type {
  EscapeRoomInitialState,
  EscapeRoomOptions,
  EscapeRoomSubmitAction,
  FirebaseStateData,
  FirebaseStoreData,
} from './types';
// Constants
import { GAME_NAMES } from '../../constants/games';
import { ESCAPE_ROOM_ACTIONS, ESCAPE_ROOM_PHASES, OUTCOME, PLAYER_COUNTS, TOTAL_ROUNDS } from './constants';
// Services
import {
  validateSubmitActionPayload,
  validateSubmitActionProperties,
  throwHttpsError,
} from '../../services/firebase-core';
import { getStateAndStoreReferences, saveGame, triggerSetupPhase } from '../../services/game-session';
// Mechanics
import { getDefaultInitialState } from '../../mechanics/session';
// Internal
import { handleSubmitCard } from './actions';
import { getEpisode } from './data';
import { determineNextPhase } from './helpers';
import {
  prepareSetupPhase,
  prepareGameOverPhase,
  prepareMissionPhase,
  prepareMissionEvaluationPhase,
  prepareResultsPhase,
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
  options: EscapeRoomOptions,
): EscapeRoomInitialState => {
  return getDefaultInitialState<EscapeRoomInitialState>({
    gameId,
    gameName: GAME_NAMES.ESCAPE_ROOM,
    uid,
    language,
    version,
    playerCounts: PLAYER_COUNTS,
    totalRounds: TOTAL_ROUNDS,
    store: {
      deck: [],
    },
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
  const nextPhase = determineNextPhase(state?.phase, state?.round, state?.outcome ?? OUTCOME.CONTINUE);

  // LOBBY -> SETUP
  if (nextPhase === ESCAPE_ROOM_PHASES.SETUP) {
    // Enter setup phase before doing anything
    await triggerSetupPhase(sessionRef);

    // Request data
    const additionalData = await getEpisode(store.language, store.options);
    const newPhase = await prepareSetupPhase(store, state, players, additionalData);
    await saveGame(sessionRef, newPhase);
    return getNextPhase(gameName, gameId);
  }

  // SETUP -> MISSION
  if (nextPhase === ESCAPE_ROOM_PHASES.MISSION) {
    const newPhase = await prepareMissionPhase(store, state, players);
    return saveGame(sessionRef, newPhase);
  }

  // * -> MISSION_EVALUATION
  if (nextPhase === ESCAPE_ROOM_PHASES.MISSION_EVALUATION) {
    const newPhase = await prepareMissionEvaluationPhase(store, state, players);
    return saveGame(sessionRef, newPhase);
  }

  // MISSION_EVALUATION -> RESULTS
  if (nextPhase === ESCAPE_ROOM_PHASES.RESULTS) {
    const newPhase = await prepareResultsPhase(store, state, players);
    return saveGame(sessionRef, newPhase);
  }

  // RESULTS -> GAME_OVER
  if (nextPhase === ESCAPE_ROOM_PHASES.GAME_OVER) {
    const newPhase = await prepareGameOverPhase(gameId, store, state, players);
    return saveGame(sessionRef, newPhase);
  }

  return true;
};

/**
 * Handles player action submissions and routes to appropriate handlers
 * @param data - The action data containing player information and action payload
 */
export const submitAction = async (data: EscapeRoomSubmitAction) => {
  const { gameId, gameName, playerId, action } = data;

  validateSubmitActionPayload(gameId, gameName, playerId, action);

  switch (action) {
    case ESCAPE_ROOM_ACTIONS.SUBMIT_CARD_PLAY:
      validateSubmitActionProperties(data, ['cardId'], 'submit card play');
      return handleSubmitCard(gameName, gameId, playerId, data.cardId);
    default:
      throwHttpsError(`Given action ${action} is not allowed`, action);
  }
};
