// Types
import type {
  FirebaseStateData,
  FirebaseStoreData,
  ViceCampeaoInitialState,
  ViceCampeaoOptions,
  ViceCampeaoSubmitAction,
} from './types';
// Constants
import { GAME_NAMES } from '../../constants/games';
import { VICE_CAMPEAO_ACTIONS, VICE_CAMPEAO_PHASES, PLAYER_COUNTS, MAX_ROUNDS } from './constants';
// Services
import {
  validateSubmitActionPayload,
  validateSubmitActionProperties,
  throwHttpsError,
} from '../../services/firebase-core';
import { getStateAndStoreReferences, saveGame, triggerSetupPhase } from '../../services/game-session';
// Utils
import utils from '../../utils';
// Internal
import { handleSubmitCard } from './actions';
import { getResourceData } from './data';
import { determineNextPhase } from './helpers';
import { prepareSetupPhase, prepareCardSelectionPhase, prepareRunPhase, prepareGameOverPhase } from './setup';

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
  options: ViceCampeaoOptions = {},
): ViceCampeaoInitialState => {
  return utils.game.getDefaultInitialState<ViceCampeaoInitialState>({
    gameId,
    gameName: GAME_NAMES.VICE_CAMPEAO,
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
  gameId: string,
  currentState?: FirebaseStateData,
): Promise<boolean> => {
  const { sessionRef, state, store, players } = await getStateAndStoreReferences<
    FirebaseStateData,
    FirebaseStoreData
  >(gameName, gameId, 'prepare next phase', currentState);

  // Determine next phase
  const nextPhase = determineNextPhase(state?.phase, state?.round);

  // LOBBY -> SETUP
  if (nextPhase === VICE_CAMPEAO_PHASES.SETUP) {
    // Enter setup phase before doing anything
    await triggerSetupPhase(sessionRef);

    // Request data
    const additionalData = await getResourceData(utils.players.getPlayerCount(players));
    const newPhase = await prepareSetupPhase(store, state, players, additionalData);
    await saveGame(sessionRef, newPhase);
    return getNextPhase(gameName, gameId);
  }

  // * -> WORD_CREATION
  if (nextPhase === VICE_CAMPEAO_PHASES.CARD_SELECTION) {
    const newPhase = await prepareCardSelectionPhase(store, state, players);
    return saveGame(sessionRef, newPhase);
  }

  // WORD_CREATION -> GUESSING
  if (nextPhase === VICE_CAMPEAO_PHASES.RUN) {
    const newPhase = await prepareRunPhase(store, state, players);
    return saveGame(sessionRef, newPhase);
  }

  // RESULTS -> GAME_OVER
  if (nextPhase === VICE_CAMPEAO_PHASES.GAME_OVER) {
    const newPhase = await prepareGameOverPhase(gameId, store, state, players);
    return saveGame(sessionRef, newPhase);
  }

  return true;
};

/**
 * Handles player action submissions and routes to appropriate handlers
 * @param data - The action data containing player information and action payload
 */
export const submitAction = async (data: ViceCampeaoSubmitAction) => {
  const { gameId, gameName, playerId, action } = data;

  validateSubmitActionPayload(gameId, gameName, playerId, action);

  switch (action) {
    case VICE_CAMPEAO_ACTIONS.SUBMIT_CARD:
      validateSubmitActionProperties(data, ['cardId', 'targetId'], 'submit card');
      return handleSubmitCard(gameName, gameId, playerId, data.cardId, data.targetId);
    default:
      throwHttpsError(`Given action ${action} is not allowed`, action);
  }
};
