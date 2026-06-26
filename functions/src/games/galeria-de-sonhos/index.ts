// Types
import type {
  FirebaseStateData,
  FirebaseStoreData,
  GaleriaDeSonhosInitialState,
  GaleriaDeSonhosOptions,
  GaleriaDeSonhosSubmitAction,
} from './types';
// Constants
import { GAME_NAMES } from '../../constants/games';
import {
  GALERIA_DE_SONHOS_ACTIONS,
  GALERIA_DE_SONHOS_PHASES,
  PLAYER_COUNTS,
  TOTAL_ROUNDS,
} from './constants';
// Services
import {
  validateSubmitActionPayload,
  validateSubmitActionProperties,
  throwHttpsError,
} from '../../services/firebase-core';
import { getStateAndStoreReferences, saveGame, triggerSetupPhase } from '../../services/game-session';
// Mechanics
import { addBots } from '../../mechanics/players';
import { getDefaultInitialState } from '../../mechanics/session';
// Internal
import { handlePlayCard, handleSubmitCards, handleSubmitWord } from './actions';
import { getWords } from './data';
import { determineNextPhase } from './helpers';
import {
  prepareCardPlayPhase,
  prepareDreamsSelectionPhase,
  prepareGameOverPhase,
  prepareResolutionPhase,
  prepareSetupPhase,
  prepareWordSelectionPhase,
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
  options: GaleriaDeSonhosOptions,
): GaleriaDeSonhosInitialState => {
  return getDefaultInitialState<GaleriaDeSonhosInitialState>({
    gameId,
    gameName: GAME_NAMES.GALERIA_DE_SONHOS,
    uid,
    language,
    version,
    playerCounts: PLAYER_COUNTS,
    totalRounds: TOTAL_ROUNDS,
    store: {
      gameOrder: [],
      tableDeck: [],
      wordsDeck: [],
    },
    options,
    onCreate: () => {
      const players: Players = {};
      if (options.withBots) {
        addBots(players, language, 3);
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
  gameId: string,
  currentState?: FirebaseStateData,
): Promise<boolean> => {
  const { sessionRef, state, store } = await getStateAndStoreReferences<FirebaseStateData, FirebaseStoreData>(
    gameName,
    gameId,
    'prepare next phase',
    currentState,
  );
  const players = state.players;

  // Determine next phase
  const nextPhase = determineNextPhase(state?.phase, state?.round);

  // LOBBY -> SETUP
  if (nextPhase === GALERIA_DE_SONHOS_PHASES.SETUP) {
    // Enter setup phase before doing anything
    await triggerSetupPhase(sessionRef);

    // Request data
    const additionalData = await getWords(store.language);
    const newPhase = await prepareSetupPhase(store, state, players, additionalData);
    await saveGame(sessionRef, newPhase);
    return getNextPhase(gameName, gameId);
  }

  // * -> WORD_SELECTION
  if (nextPhase === GALERIA_DE_SONHOS_PHASES.WORD_SELECTION) {
    const newPhase = await prepareWordSelectionPhase(store, state, players);
    return saveGame(sessionRef, newPhase);
  }

  // WORD_SELECTION -> DREAMS_SELECTION
  if (nextPhase === GALERIA_DE_SONHOS_PHASES.DREAMS_SELECTION) {
    const newPhase = await prepareDreamsSelectionPhase(store, state, players);
    return saveGame(sessionRef, newPhase);
  }

  // DREAMS_SELECTION -> CARD_PLAY
  if (nextPhase === GALERIA_DE_SONHOS_PHASES.CARD_PLAY) {
    const newPhase = await prepareCardPlayPhase(store, state, players);
    return saveGame(sessionRef, newPhase);
  }

  // CARD_PLAY -> RESOLUTION
  if (nextPhase === GALERIA_DE_SONHOS_PHASES.RESOLUTION) {
    const newPhase = await prepareResolutionPhase(store, state, players);
    return saveGame(sessionRef, newPhase);
  }

  // RESOLUTION -> GAME_OVER
  if (nextPhase === GALERIA_DE_SONHOS_PHASES.GAME_OVER) {
    const newPhase = await prepareGameOverPhase(gameId, store, state, players);
    return saveGame(sessionRef, newPhase);
  }

  return true;
};

/**
 * Handles player action submissions and routes to appropriate handlers
 * @param data - The action data containing player information and action payload
 */
export const submitAction = async (data: GaleriaDeSonhosSubmitAction) => {
  const { gameId, gameName, playerId, action } = data;

  validateSubmitActionPayload(gameId, gameName, playerId, action);

  switch (action) {
    case GALERIA_DE_SONHOS_ACTIONS.SUBMIT_WORD:
      validateSubmitActionProperties(data, ['wordId'], 'submit word');
      return handleSubmitWord(gameName, gameId, playerId, data.wordId);
    case GALERIA_DE_SONHOS_ACTIONS.SUBMIT_CARDS:
      validateSubmitActionProperties(data, ['cardsIds'], 'submit cards');
      return handleSubmitCards(gameName, gameId, playerId, data.cardsIds);
    case GALERIA_DE_SONHOS_ACTIONS.PLAY_CARD:
      validateSubmitActionProperties(data, ['cardId'], 'play card');
      return handlePlayCard(gameName, gameId, playerId, data.cardId);
    default:
      throwHttpsError(`Given action ${action} is not allowed`, action);
  }
};
