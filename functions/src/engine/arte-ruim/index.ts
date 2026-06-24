// Constants
import { GAME_NAMES } from '../../utils/constants';
import { ARTE_RUIM_PHASES, PLAYER_COUNTS, MAX_ROUNDS, ARTE_RUIM_ACTIONS } from './constants';
// Types
import type {
  ArteRuimGameOptions,
  ArteRuimInitialState,
  ArteRuimSubmitAction,
  FirebaseStateData,
  FirebaseStoreData,
} from './types';
// Utilities
import utils from '../../utils';
// Internal Functions
import { determineGameOver, determineNextPhase } from './helpers';
import {
  prepareSetupPhase,
  prepareDrawPhase,
  prepareEvaluationPhase,
  prepareGalleryPhase,
  prepareGameOverPhase,
} from './setup';
import { getCards } from './data';
import { handleSubmitDrawing, handleSubmitVoting } from './actions';
import {
  validateSubmitActionPayload,
  validateSubmitActionProperties,
  throwHttpsError,
} from '../../services/firebase-core';
import { getStateAndStoreReferences, saveGame, triggerSetupPhase } from '../../services/game-session';

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
  options: ArteRuimGameOptions,
): ArteRuimInitialState => {
  return utils.game.getDefaultInitialState<ArteRuimInitialState>({
    gameId,
    gameName: GAME_NAMES.ARTE_RUIM,
    uid,
    language,
    version,
    playerCounts: PLAYER_COUNTS,
    totalRounds: MAX_ROUNDS,
    store: {
      deck: [],
      usedCards: [],
      currentCards: [],
      pastDrawings: [],
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
  const { sessionRef, state, store, players } = await getStateAndStoreReferences<
    FirebaseStateData,
    FirebaseStoreData
  >(gameName, gameId, 'prepare next phase', currentState);

  // Determine if it's game over
  const isGameOver = determineGameOver(players, state?.round);
  // Determine next phase
  const nextPhase = determineNextPhase(state?.phase, state?.round, isGameOver);

  // LOBBY -> SETUP
  if (nextPhase === ARTE_RUIM_PHASES.SETUP) {
    // Enter setup phase before doing anything
    await triggerSetupPhase(sessionRef);

    // Request data
    const data = await getCards(
      store.language,
      utils.players.getPlayerCount(players),
      store.options as ArteRuimGameOptions,
    );
    const newPhase = await prepareSetupPhase(store, state, players, data);
    await saveGame(sessionRef, newPhase);
    return getNextPhase(gameName, gameId);
  }

  // SETUP -> DRAW
  if (nextPhase === ARTE_RUIM_PHASES.DRAW) {
    const newPhase = await prepareDrawPhase(store, state, players);
    return saveGame(sessionRef, newPhase);
  }

  // DRAW -> EVALUATION
  if (nextPhase === ARTE_RUIM_PHASES.EVALUATION) {
    const newPhase = await prepareEvaluationPhase(store, state, players);
    return saveGame(sessionRef, newPhase);
  }

  // EVALUATION -> GALLERY
  if (nextPhase === ARTE_RUIM_PHASES.GALLERY) {
    const newPhase = await prepareGalleryPhase(store, state, players);
    return saveGame(sessionRef, newPhase);
  }

  // GALLERY -> GAME_OVER
  if (nextPhase === ARTE_RUIM_PHASES.GAME_OVER) {
    const newPhase = await prepareGameOverPhase(gameId, store, state, players);
    return saveGame(sessionRef, newPhase);
  }

  return true;
};

/**
 * Handles player action submissions and routes to appropriate handlers
 * @param data - The action data containing player information and action payload
 */
export const submitAction = async (data: ArteRuimSubmitAction) => {
  const { gameId, gameName, playerId, action } = data;

  validateSubmitActionPayload(gameId, gameName, playerId, action);

  switch (action) {
    case ARTE_RUIM_ACTIONS.SUBMIT_DRAWING:
      validateSubmitActionProperties(data, ['drawing'], 'submit drawing');
      return handleSubmitDrawing(gameName, gameId, playerId, data.drawing);
    case ARTE_RUIM_ACTIONS.SUBMIT_VOTING:
      validateSubmitActionProperties(data, ['votes'], 'submit votes');
      return handleSubmitVoting(gameName, gameId, playerId, data.votes, data.choseRandomly);
    default:
      throwHttpsError(`Given action ${action} is not allowed`, action);
  }
};
