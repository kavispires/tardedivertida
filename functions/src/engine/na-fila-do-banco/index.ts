// Constants
import { GAME_NAMES } from '../../utils/constants';
import { NA_FILA_DO_BANCO_ACTIONS, NA_FILA_DO_BANCO_PHASES, PLAYER_COUNTS, TOTAL_ROUNDS } from './constants';
// Types
import type {
  FirebaseStateData,
  FirebaseStoreData,
  NaFilaDoBancoInitialState,
  NaFilaDoBancoSubmitAction,
} from './types';
// Utilities
import utils from '../../utils';
// Internal Functions
import { determineNextPhase } from './helpers';
import {
  prepareSetupPhase,
  prepareGameOverPhase,
  prepareCardPlayPhase,
  prepareRoundResolutionPhase,
} from './setup';
import { handleSubmitCard } from './actions';
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
): NaFilaDoBancoInitialState => {
  return utils.game.getDefaultInitialState<NaFilaDoBancoInitialState>({
    gameId,
    gameName: GAME_NAMES.NA_FILA_DO_BANCO,
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
  const { sessionRef, state, store, players } = await utils.firestore.getStateAndStoreReferences<
    FirebaseStateData,
    FirebaseStoreData
  >(gameName, gameId, 'prepare next phase', currentState);

  // Determine next phase
  const nextPhase = determineNextPhase(state?.phase, state.round, state.outcome);

  // LOBBY -> SETUP
  if (nextPhase === NA_FILA_DO_BANCO_PHASES.SETUP) {
    // Enter setup phase before doing anything
    await utils.firestore.triggerSetupPhase(sessionRef);

    const newPhase = await prepareSetupPhase(store, state, players);
    await utils.firestore.saveGame(sessionRef, newPhase);
    return getNextPhase(gameName, gameId);
  }

  // * -> CARD_PLAY
  if (nextPhase === NA_FILA_DO_BANCO_PHASES.CARD_PLAY) {
    const newPhase = await prepareCardPlayPhase(store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  // CARD_PLAY -> ROUND_RESOLUTION
  if (nextPhase === NA_FILA_DO_BANCO_PHASES.ROUND_RESOLUTION) {
    const newPhase = await prepareRoundResolutionPhase(store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  // ROUND_RESOLUTION -> GAME_OVER
  if (nextPhase === NA_FILA_DO_BANCO_PHASES.GAME_OVER) {
    const newPhase = await prepareGameOverPhase(gameId, store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  return true;
};

/**
 * Handles pattern submission
 * May trigger next phase
 */
export const submitAction = async (data: NaFilaDoBancoSubmitAction) => {
  const { gameId, gameName, playerId, action } = data;

  validateSubmitActionPayload(gameId, gameName, playerId, action);

  switch (action) {
    case NA_FILA_DO_BANCO_ACTIONS.PLAY_CARD:
      validateSubmitActionProperties(data, ['cardId', 'tellerId', 'newCardId'], 'submit card');
      return handleSubmitCard(gameName, gameId, playerId, data.cardId, data.tellerId, data.newCardId);
    default:
      throwHttpsError(`Given action ${action} is not allowed`, action);
  }
};
