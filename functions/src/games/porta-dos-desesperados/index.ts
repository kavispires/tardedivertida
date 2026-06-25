// Types
import type {
  PortaDosDesesperadosInitialState,
  PortaDosDesesperadosSubmitAction,
  FirebaseStateData,
  FirebaseStoreData,
  PortaDosDesesperadosOptions,
} from './types';
// Constants
import { GAME_NAMES } from '../../constants/games';
import {
  PORTA_DOS_DESESPERADOS_PHASES,
  PLAYER_COUNTS,
  MAX_ROUNDS,
  PORTA_DOS_DESESPERADOS_ACTIONS,
} from './constants';
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
import { handleSubmitDoor, handleSubmitPages } from './actions';
import { getData } from './data';
import { determineGameOver, determineNextPhase } from './helpers';
import {
  prepareSetupPhase,
  prepareGameOverPhase,
  prepareBookPossessionPhase,
  prepareDoorChoicePhase,
  prepareResolutionPhase,
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
  options: PortaDosDesesperadosOptions,
): PortaDosDesesperadosInitialState => {
  return utils.game.getDefaultInitialState<PortaDosDesesperadosInitialState>({
    gameId,
    gameName: GAME_NAMES.PORTA_DOS_DESESPERADOS,
    uid,
    language,
    version,
    playerCounts: PLAYER_COUNTS,
    totalRounds: MAX_ROUNDS,
    store: {
      relationships: {},
      finalDoors: [],
    },
    options,
    onCreate: () => {
      const players: Players = {};
      if (options.withBots) {
        utils.players.addBots(players, language, 2);
      }
      return {
        players,
      };
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
  gameId: UID,
  currentState?: FirebaseStateData,
): Promise<boolean> => {
  const { sessionRef, state, store, players } = await getStateAndStoreReferences<
    FirebaseStateData,
    FirebaseStoreData
  >(gameName, gameId, 'prepare next phase', currentState);

  // Determine if it's game over
  const isGameOver = determineGameOver(
    state?.phase,
    state?.round,
    state?.outcome,
    state?.winCondition,
    state?.currentCorridor,
    state?.magic,
  );
  // Determine next phase
  const nextPhase = determineNextPhase(state?.phase, state?.round, isGameOver);

  // LOBBY -> SETUP
  if (nextPhase === PORTA_DOS_DESESPERADOS_PHASES.SETUP) {
    // Enter setup phase before doing anything
    await triggerSetupPhase(sessionRef);

    // Request data
    const additionalData = await getData();

    const newPhase = await prepareSetupPhase(store, state, players, additionalData);
    await saveGame(sessionRef, newPhase);
    return getNextPhase(gameName, gameId);
  }

  // * -> BOOK_POSSESSION
  if (nextPhase === PORTA_DOS_DESESPERADOS_PHASES.BOOK_POSSESSION) {
    const newPhase = await prepareBookPossessionPhase(store, state, players);
    return saveGame(sessionRef, newPhase);
  }

  // BOOK_POSSESSION -> DOOR_CHOICE
  if (nextPhase === PORTA_DOS_DESESPERADOS_PHASES.DOOR_CHOICE) {
    const newPhase = await prepareDoorChoicePhase(store, state, players);
    return saveGame(sessionRef, newPhase);
  }

  // DOOR_CHOICE -> RESOLUTION
  if (nextPhase === PORTA_DOS_DESESPERADOS_PHASES.RESOLUTION) {
    const newPhase = await prepareResolutionPhase(store, state, players);
    return saveGame(sessionRef, newPhase);
  }

  // RESOLUTION -> GAME_OVER
  if (nextPhase === PORTA_DOS_DESESPERADOS_PHASES.GAME_OVER) {
    const newPhase = await prepareGameOverPhase(gameId, store, state, players);
    return saveGame(sessionRef, newPhase);
  }

  return true;
};

/**
 * Handles player action submissions and routes to appropriate handlers
 * @param data - The action data containing player information and action payload
 */
export const submitAction = async (data: PortaDosDesesperadosSubmitAction) => {
  const { gameId, gameName, playerId, action } = data;

  validateSubmitActionPayload(gameId, gameName, playerId, action);

  switch (action) {
    case PORTA_DOS_DESESPERADOS_ACTIONS.SUBMIT_PAGES:
      validateSubmitActionProperties(data, ['pageIds'], 'submit pages');
      return handleSubmitPages(gameName, gameId, playerId, data.pageIds);
    case PORTA_DOS_DESESPERADOS_ACTIONS.SUBMIT_DOOR:
      validateSubmitActionProperties(data, ['doorId'], 'submit door');
      return handleSubmitDoor(gameName, gameId, playerId, data.doorId, data.ready);
    default:
      throwHttpsError(`Given action ${action} is not allowed`, action);
  }
};
