// Types
import type {
  FirebaseStateData,
  FirebaseStoreData,
  MenteColetivaInitialState,
  MenteColetivaOptions,
  MenteColetivaSubmitAction,
} from './types';
// Constants
import { GAME_NAMES } from '../../constants/games';
import { MENTE_COLETIVA_PHASES, MAX_ROUNDS, PLAYER_COUNTS, MENTE_COLETIVA_ACTIONS } from './constants';
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
import {
  handleAddAnswer,
  handleNextAnswers,
  handleSubmitAnswers,
  handleSubmitCustomQuestion,
  handleSubmitQuestion,
} from './actions';
import { getQuestions } from './data';
import { determineNextPhase, determineGameOver } from './helpers';
import {
  prepareSetupPhase,
  prepareGameOverPhase,
  prepareQuestionSelectionPhase,
  prepareEverybodyWritesPhase,
  prepareComparePhase,
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
  options: MenteColetivaOptions,
): MenteColetivaInitialState => {
  return utils.game.getDefaultInitialState<MenteColetivaInitialState>({
    gameId,
    gameName: GAME_NAMES.MENTE_COLETIVA,
    uid,
    language,
    version,
    playerCounts: PLAYER_COUNTS,
    totalRounds: MAX_ROUNDS,
    store: {
      deck: [],
      gameOrder: [],
      pastQuestions: [],
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
  const isGameOver = determineGameOver(players, store.options?.shortPasture);
  // Determine next phase
  const nextPhase = determineNextPhase(state?.phase, state.round, isGameOver);

  // LOBBY -> SETUP
  if (nextPhase === MENTE_COLETIVA_PHASES.SETUP) {
    // Enter setup phase before doing anything
    await triggerSetupPhase(sessionRef);

    // Request data
    const additionalData = await getQuestions(store.language);
    const newPhase = await prepareSetupPhase(store, state, players, additionalData);
    await saveGame(sessionRef, newPhase);
    return getNextPhase(gameName, gameId);
  }

  // SETUP/* -> QUESTION_SELECTION
  if (nextPhase === MENTE_COLETIVA_PHASES.QUESTION_SELECTION) {
    const newPhase = await prepareQuestionSelectionPhase(store, state, players);
    return saveGame(sessionRef, newPhase);
  }

  // QUESTION_SELECTION -> EVERYBODY_WRITES
  if (nextPhase === MENTE_COLETIVA_PHASES.EVERYBODY_WRITES) {
    const newPhase = await prepareEverybodyWritesPhase(store, state, players);
    return saveGame(sessionRef, newPhase);
  }

  // EVERYBODY_WRITES -> COMPARE
  if (nextPhase === MENTE_COLETIVA_PHASES.COMPARE) {
    const newPhase = await prepareComparePhase(store, state, players);
    return saveGame(sessionRef, newPhase);
  }

  // COMPARE -> RESOLUTION
  if (nextPhase === MENTE_COLETIVA_PHASES.RESOLUTION) {
    const newPhase = await prepareResolutionPhase(store, state, players);
    return saveGame(sessionRef, newPhase);
  }

  // GUESS -> GAME_OVER
  if (nextPhase === MENTE_COLETIVA_PHASES.GAME_OVER) {
    const newPhase = await prepareGameOverPhase(gameId, store, state, players);

    return saveGame(sessionRef, newPhase);
  }

  return true;
};

/**
 * Handles player action submissions and routes to appropriate handlers
 * @param data - The action data containing player information and action payload
 */
export const submitAction = async (data: MenteColetivaSubmitAction) => {
  const { gameId, gameName, playerId, action } = data;

  validateSubmitActionPayload(gameId, gameName, playerId, action);

  switch (action) {
    case MENTE_COLETIVA_ACTIONS.SUBMIT_QUESTION:
      validateSubmitActionProperties(data, ['questionId'], 'submit question');
      return handleSubmitQuestion(gameName, gameId, playerId, data.questionId);
    case MENTE_COLETIVA_ACTIONS.SUBMIT_CUSTOM_QUESTION:
      validateSubmitActionProperties(data, ['customQuestion'], 'submit question');
      return handleSubmitCustomQuestion(gameName, gameId, playerId, data.customQuestion);
    case MENTE_COLETIVA_ACTIONS.SUBMIT_ANSWERS:
      validateSubmitActionProperties(data, ['answers'], 'submit answers');
      return handleSubmitAnswers(gameName, gameId, playerId, data.answers);
    case MENTE_COLETIVA_ACTIONS.NEXT_ANSWERS:
      validateSubmitActionProperties(data, ['allowedList'], 'advance answers');
      return handleNextAnswers(gameName, gameId, playerId, data.allowedList);
    case MENTE_COLETIVA_ACTIONS.ADD_ANSWER:
      validateSubmitActionProperties(data, ['answer'], 'add answer');
      return handleAddAnswer(gameName, gameId, playerId, data.answer);
    default:
      throwHttpsError(`Given action ${action} is not allowed`, action);
  }
};
