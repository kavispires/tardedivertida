// Constants
import { GAME_NAMES } from '../../utils/constants';
import { LABIRINTO_SECRETO_PHASES, PLAYER_COUNTS, MAX_ROUNDS, LABIRINTO_SECRETO_ACTIONS } from './constants';
// Types
import type {
  LabirintoSecretoGameOptions,
  LabirintoSecretoInitialState,
  LabirintoSecretoSubmitAction,
  FirebaseStateData,
  FirebaseStoreData,
} from './types';
// Utilities
import utils from '../../utils';
// Internal Functions
import { determineGameOver, determineNextPhase } from './helpers';
import {
  prepareSetupPhase,
  prepareGameOverPhase,
  prepareMapBuildingPhase,
  preparePathFollowingPhase,
  prepareResultsPhase,
} from './setup';
import { getData } from './data';
import { handleSubmitMap, handleSubmitPath } from './actions';
import {
  validateSubmitActionPayload,
  validateSubmitActionProperties,
  throwHttpsError,
} from '../../services/firebase-core';
import {
  getStateAndStoreReferences,
  saveGame,
  triggerSetupPhase,
  triggerWaitPhase,
} from '../../services/game-session';

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
  options: LabirintoSecretoGameOptions,
): LabirintoSecretoInitialState => {
  return utils.game.getDefaultInitialState<LabirintoSecretoInitialState>({
    gameId,
    gameName: GAME_NAMES.LABIRINTO_SECRETO,
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
  gameId: UID,
  currentState?: FirebaseStateData,
): Promise<boolean> => {
  const { sessionRef, state, store, players } = await getStateAndStoreReferences<
    FirebaseStateData,
    FirebaseStoreData
  >(gameName, gameId, 'prepare next phase', currentState);

  // Determine if it's game over
  const isGameOver = determineGameOver(players);
  // Determine next phase
  const nextPhase = determineNextPhase(
    state?.phase,
    state?.round,
    isGameOver,
    state?.turnOrder ?? [],
    state?.activePlayerId,
  );

  // LOBBY -> SETUP
  if (nextPhase === LABIRINTO_SECRETO_PHASES.SETUP) {
    // Enter setup phase before doing anything
    await triggerSetupPhase(sessionRef);

    // Request data
    const data = await getData(store.language, utils.players.getPlayerCount(players), store?.options ?? {});
    const newPhase = await prepareSetupPhase(store, state, players, data);
    await saveGame(sessionRef, newPhase);
    return getNextPhase(gameName, gameId);
  }

  // SETUP -> DRAW
  if (nextPhase === LABIRINTO_SECRETO_PHASES.MAP_BUILDING) {
    const newPhase = await prepareMapBuildingPhase(store, state, players);
    return saveGame(sessionRef, newPhase);
  }

  // DRAW -> EVALUATION
  if (nextPhase === LABIRINTO_SECRETO_PHASES.PATH_FOLLOWING) {
    await triggerWaitPhase(sessionRef);
    const newPhase = await preparePathFollowingPhase(store, state, players);
    return saveGame(sessionRef, newPhase);
  }

  // EVALUATION -> GALLERY
  if (nextPhase === LABIRINTO_SECRETO_PHASES.RESULTS) {
    const newPhase = await prepareResultsPhase(store, state, players);
    return saveGame(sessionRef, newPhase);
  }

  // GALLERY -> GAME_OVER
  if (nextPhase === LABIRINTO_SECRETO_PHASES.GAME_OVER) {
    const newPhase = await prepareGameOverPhase(gameId, store, state, players);
    return saveGame(sessionRef, newPhase);
  }

  return true;
};

/**
 * Handles player action submissions and routes to appropriate handlers
 * @param data - The action data containing player information and action payload
 */
export const submitAction = async (data: LabirintoSecretoSubmitAction) => {
  const { gameId, gameName, playerId, action } = data;

  validateSubmitActionPayload(gameId, gameName, playerId, action);

  switch (action) {
    case LABIRINTO_SECRETO_ACTIONS.SUBMIT_MAP:
      validateSubmitActionProperties(data, ['newMap'], 'submit map');
      return handleSubmitMap(gameName, gameId, playerId, data.newMap, data.mulligan);
    case LABIRINTO_SECRETO_ACTIONS.SUBMIT_PATH:
      validateSubmitActionProperties(data, ['pathId', 'guess', 'choseRandomly'], 'submit guess');
      return handleSubmitPath(gameName, gameId, playerId, data.pathId, data.guess, data.choseRandomly);
    default:
      throwHttpsError(`Given action ${action} is not allowed`, action);
  }
};
