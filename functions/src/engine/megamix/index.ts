// Constants
import { GAME_NAMES } from '../../utils/constants';
import { MEGAMIX_PHASES, PLAYER_COUNTS, TOTAL_ROUNDS, MEGAMIX_ACTIONS } from './constants';
// Types
import type {
  MegamixGameOptions,
  MegamixInitialState,
  MegamixSubmitAction,
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
  prepareSeedingPhase,
  prepareTrackPhase,
  prepareResultPhase,
} from './setup';
import { getData } from './data';
import { handleSubmitSeeds, handleSubmitTrackAnswer } from './actions';
import {
  validateSubmitActionPayload,
  validateSubmitActionProperties,
  throwHttpsError,
} from '../../services/firebase-core';

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
  options: MegamixGameOptions,
): MegamixInitialState => {
  return utils.game.getDefaultInitialState<MegamixInitialState>({
    gameId,
    gameName: GAME_NAMES.MEGAMIX,
    uid,
    language,
    version,
    playerCounts: PLAYER_COUNTS,
    totalRounds: TOTAL_ROUNDS,
    store: {
      tracks: [],
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
  gameId: UID,
  currentState?: FirebaseStateData,
): Promise<boolean> => {
  const { sessionRef, state, store, players } = await utils.firestore.getStateAndStoreReferences<
    FirebaseStateData,
    FirebaseStoreData
  >(gameName, gameId, 'prepare next phase', currentState);

  // Determine next phase
  const nextPhase = determineNextPhase(state?.phase, state?.round);

  // LOBBY -> SETUP
  if (nextPhase === MEGAMIX_PHASES.SETUP) {
    // Enter setup phase before doing anything
    await utils.firestore.triggerSetupPhase(sessionRef);

    // Request data
    const data = await getData(
      store.language,
      store.options as MegamixGameOptions,
      utils.players.getPlayerCount(players),
    );
    const newPhase = await prepareSetupPhase(store, state, players, data);
    await utils.firestore.saveGame(sessionRef, newPhase);
    return getNextPhase(gameName, gameId);
  }

  // SETUP -> SEEDING
  if (nextPhase === MEGAMIX_PHASES.SEEDING) {
    const newPhase = await prepareSeedingPhase(store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  // SEEDING/RESULT -> TRACK
  if (nextPhase === MEGAMIX_PHASES.TRACK) {
    const newPhase = await prepareTrackPhase(store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  // TRACK -> RESULT
  if (nextPhase === MEGAMIX_PHASES.RESULT) {
    const newPhase = await prepareResultPhase(store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  // RESULT -> GAME_OVER
  if (nextPhase === MEGAMIX_PHASES.GAME_OVER) {
    const newPhase = await prepareGameOverPhase(gameId, store, state, players);

    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  return true;
};

/**
 * Handles player action submissions and routes to appropriate handlers
 * @param data - The action data containing player information and action payload
 */
export const submitAction = async (data: MegamixSubmitAction) => {
  const { gameId, gameName, playerId, action } = data;

  validateSubmitActionPayload(gameId, gameName, playerId, action);

  switch (action) {
    case MEGAMIX_ACTIONS.SUBMIT_SEEDS:
      validateSubmitActionProperties(data, ['data'], 'submit seeds');
      return handleSubmitSeeds(gameName, gameId, playerId, data.data);
    case MEGAMIX_ACTIONS.SUBMIT_TRACK_ANSWER:
      validateSubmitActionProperties(data, ['data'], 'submit data');
      return handleSubmitTrackAnswer(gameName, gameId, playerId, data.data);
    default:
      throwHttpsError(`Given action ${action} is not allowed`, action);
  }
};
