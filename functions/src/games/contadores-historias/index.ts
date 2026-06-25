// Types
import type {
  ContadoresHistoriasInitialState,
  ContadoresHistoriasOptions,
  ContadoresHistoriasSubmitAction,
  FirebaseStateData,
  FirebaseStoreData,
} from './types';
// Constants
import { GAME_NAMES } from '../../constants/games';
import {
  CONTADORES_HISTORIAS_ACTIONS,
  CONTADORES_HISTORIAS_PHASES,
  MAX_ROUNDS,
  PLAYER_COUNTS,
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
import { handlePlayCard, handleSubmitStory, handleSubmitVote } from './actions';
import { getData } from './data';
import { determineGameOver, determineNextPhase } from './helpers';
import {
  prepareCardPlayPhase,
  prepareGameOverPhase,
  prepareResolutionPhase,
  prepareSetupPhase,
  prepareStoryPhase,
  prepareVotingPhase,
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
  options: ContadoresHistoriasOptions,
): ContadoresHistoriasInitialState => {
  return utils.game.getDefaultInitialState<ContadoresHistoriasInitialState>({
    gameId,
    gameName: GAME_NAMES.CONTADORES_HISTORIAS,
    uid,
    language,
    version,
    playerCounts: PLAYER_COUNTS,
    totalRounds: MAX_ROUNDS,
    store: {
      gameOrder: [],
      tableDeck: [],
      deckIndex: -1,
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

  // Determine if it's game over
  const isGameOver = determineGameOver(players, store.options, state.round);
  // Determine next phase
  const nextPhase = determineNextPhase(state?.phase, state?.round, isGameOver);

  // LOBBY -> SETUP
  if (nextPhase === CONTADORES_HISTORIAS_PHASES.SETUP) {
    // Enter setup phase before doing anything
    await triggerSetupPhase(sessionRef);

    // Request data
    const additionalData = await getData(utils.players.getPlayerCount(players));

    const newPhase = await prepareSetupPhase(store, state, players, additionalData);
    await saveGame(sessionRef, newPhase);

    return getNextPhase(gameName, gameId);
  }

  // * -> STORY
  if (nextPhase === CONTADORES_HISTORIAS_PHASES.STORY) {
    const newPhase = await prepareStoryPhase(store, state, players);
    return saveGame(sessionRef, newPhase);
  }

  // STORY -> CARD_PLAY
  if (nextPhase === CONTADORES_HISTORIAS_PHASES.CARD_PLAY) {
    const newPhase = await prepareCardPlayPhase(store, state, players);
    return saveGame(sessionRef, newPhase);
  }

  // CARD_PLAY -> VOTING
  if (nextPhase === CONTADORES_HISTORIAS_PHASES.VOTING) {
    const newPhase = await prepareVotingPhase(store, state, players);
    return saveGame(sessionRef, newPhase);
  }

  // VOTING -> RESOLUTION
  if (nextPhase === CONTADORES_HISTORIAS_PHASES.RESOLUTION) {
    const newPhase = await prepareResolutionPhase(store, state, players);
    return saveGame(sessionRef, newPhase);
  }

  // RESOLUTION -> GAME_OVER
  if (nextPhase === CONTADORES_HISTORIAS_PHASES.GAME_OVER) {
    const newPhase = await prepareGameOverPhase(gameId, store, state, players);
    return saveGame(sessionRef, newPhase);
  }

  return true;
};

/**
 * Handles player action submissions and routes to appropriate handlers
 * @param data - The action data containing player information and action payload
 */
export const submitAction = async (data: ContadoresHistoriasSubmitAction) => {
  const { gameId, gameName, playerId, action } = data;

  validateSubmitActionPayload(gameId, gameName, playerId, action);

  switch (action) {
    case CONTADORES_HISTORIAS_ACTIONS.SUBMIT_STORY:
      validateSubmitActionProperties(data, ['story', 'cardId'], 'submit story');
      return handleSubmitStory(gameName, gameId, playerId, data.story, data.cardId);
    case CONTADORES_HISTORIAS_ACTIONS.PLAY_CARD:
      validateSubmitActionProperties(data, ['cardId'], 'play card');
      return handlePlayCard(gameName, gameId, playerId, data.cardId);
    case CONTADORES_HISTORIAS_ACTIONS.SUBMIT_VOTE:
      validateSubmitActionProperties(data, ['vote'], 'submit vote');
      return handleSubmitVote(gameName, gameId, playerId, data.vote);
    default:
      throwHttpsError(`Given action ${action} is not allowed`, action);
  }
};
