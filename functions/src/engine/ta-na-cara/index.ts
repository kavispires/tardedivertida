// Constants
import { GAME_NAMES } from '../../utils/constants';
import { MAX_ROUNDS, PLAYER_COUNTS, TA_NA_CARA_PHASES, TA_NA_CARA_ACTIONS } from './constants';
// Types
import type {
  FirebaseStateData,
  FirebaseStoreData,
  TaNaCaraInitialState,
  TaNaCaraOptions,
  TaNaCaraState,
  TaNaCaraSubmitAction,
} from './types';
// Utils
import utils from '../../utils';
// Internal Functions
import { determineNextPhase } from './helpers';
import { getResourceData } from './data';
import { handleSubmitAnswer, handleSubmitGuess, handleSubmitPrompt, handleTriggerGuessing } from './actions';
import {
  prepareSetupPhase,
  prepareGameOverPhase,
  preparePromptPhase,
  prepareAnsweringPhase,
  prepareGuessingPhase,
} from './setup';
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
  options: TaNaCaraOptions,
): TaNaCaraInitialState => {
  return utils.game.getDefaultInitialState<TaNaCaraInitialState>({
    gameId,
    gameName: GAME_NAMES.TA_NA_CARA,
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
  const { sessionRef, state, store, players } = await utils.firestore.getStateAndStoreReferences<
    FirebaseStateData,
    FirebaseStoreData
  >(gameName, gameId, 'prepare next phase', currentState);

  // Determine next phase
  const nextPhase = determineNextPhase(state as TaNaCaraState);

  // LOBBY -> SETUP
  if (nextPhase === TA_NA_CARA_PHASES.SETUP) {
    // Enter setup phase before doing anything
    await utils.firestore.triggerSetupPhase(sessionRef);

    // Request data
    const additionalData = await getResourceData(store.language, store.options);
    const newPhase = await prepareSetupPhase(store, state, players, additionalData);
    await utils.firestore.saveGame(sessionRef, newPhase);
    return getNextPhase(gameName, gameId);
  }

  // * -> PROMPT
  if (nextPhase === TA_NA_CARA_PHASES.PROMPT) {
    const newPhase = await preparePromptPhase(store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  // PROMPT -> ANSWERING
  if (nextPhase === TA_NA_CARA_PHASES.ANSWERING) {
    const newPhase = await prepareAnsweringPhase(store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  // PROMPT -> GUESSING
  if (nextPhase === TA_NA_CARA_PHASES.GUESSING) {
    const newPhase = await prepareGuessingPhase(store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  // REVEAL --> GAME_OVER
  if (nextPhase === TA_NA_CARA_PHASES.GAME_OVER) {
    const newPhase = await prepareGameOverPhase(gameId, store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  return true;
};

/**
 * Handles player action submissions and routes to appropriate handlers
 * @param data - The action data containing player information and action payload
 */
export const submitAction = async (data: TaNaCaraSubmitAction) => {
  const { gameId, gameName, playerId, action } = data;

  validateSubmitActionPayload(gameId, gameName, playerId, action);

  switch (action) {
    case TA_NA_CARA_ACTIONS.SUBMIT_PROMPT:
      if (!('questionId' in data) && !('question' in data)) {
        throwHttpsError(
          `Missing required property 'questionId' or 'question' for action ${action}`,
          'submit prompt',
        );
      }
      return handleSubmitPrompt(gameName, gameId, playerId, data.questionId, data.question);
    case TA_NA_CARA_ACTIONS.SUBMIT_ANSWER:
      validateSubmitActionProperties(data, ['answer'], 'submit answer');
      return handleSubmitAnswer(gameName, gameId, playerId, data.answer);
    case TA_NA_CARA_ACTIONS.TRIGGER_GUESSING:
      return handleTriggerGuessing(gameName, gameId, playerId);
    case TA_NA_CARA_ACTIONS.SUBMIT_GUESS:
      validateSubmitActionProperties(data, ['characterId'], 'submit character');
      return handleSubmitGuess(gameName, gameId, playerId, data.characterId);
    default:
      throwHttpsError(`Given action ${action} is not allowed`, action);
  }
};
