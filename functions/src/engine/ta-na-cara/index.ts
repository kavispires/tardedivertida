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
  TaNaCaraStore,
  TaNaCaraSubmitAction,
} from './types';
// Utils
import utils from '../../utils';
// Internal Functions
import { determineNextPhase } from './helpers';
import { getResourceData } from './data';
import { handleSubmitAnswer, handleSubmitGuess, handleSubmitPrompt, handleSubmitTarget } from './actions';
import {
  prepareSetupPhase,
  prepareGameOverPhase,
  preparePromptPhase,
  prepareAnsweringPhase,
  prepareGuessingPhase,
  prepareRevealPhase,
} from './setup';

/**
 * Get Initial Game State
 * @param gameId
 * @param uid
 * @param language
 * @returns
 */
export const getInitialState = (
  gameId: GameId,
  uid: string,
  language: Language,
  version: string,
  options: TaNaCaraOptions,
): TaNaCaraInitialState => {
  return utils.helpers.getDefaultInitialState<TaNaCaraInitialState>({
    gameId,
    gameName: GAME_NAMES.TA_NA_CARA,
    uid,
    language,
    version,
    playerCounts: PLAYER_COUNTS,
    initialPhase: TA_NA_CARA_PHASES.LOBBY,
    totalRounds: MAX_ROUNDS,
    store: {},
    options,
  });
};

/**
 * Exposes min and max player count
 */
export const getPlayerCounts = () => PLAYER_COUNTS;

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
  const nextPhase = determineNextPhase(state as TaNaCaraState, store as TaNaCaraStore);

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

  // PROMPT/ANSWERING -> REVEAL
  if (nextPhase === TA_NA_CARA_PHASES.REVEAL) {
    const newPhase = await prepareRevealPhase(store, state, players);
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
 * Perform action submitted by the app
 * @param data
 * @returns
 */
export const submitAction = async (data: TaNaCaraSubmitAction) => {
  const { gameId, gameName, playerId, action } = data;

  utils.firebase.validateSubmitActionPayload(gameId, gameName, playerId, action);

  switch (action) {
    case TA_NA_CARA_ACTIONS.SUBMIT_PROMPT:
      utils.firebase.validateSubmitActionProperties(data, ['questionId'], 'submit prompt');
      return handleSubmitPrompt(gameName, gameId, playerId, data.questionId);
    case TA_NA_CARA_ACTIONS.SUBMIT_TARGET:
      utils.firebase.validateSubmitActionProperties(data, ['targetId'], 'submit target');
      return handleSubmitTarget(gameName, gameId, playerId, data.targetId);
    case TA_NA_CARA_ACTIONS.SUBMIT_GUESS:
      utils.firebase.validateSubmitActionProperties(data, ['characterId'], 'submit character');
      return handleSubmitGuess(gameName, gameId, playerId, data.characterId);
    case TA_NA_CARA_ACTIONS.SUBMIT_ANSWER:
      utils.firebase.validateSubmitActionProperties(data, ['answer'], 'submit answer');
      return handleSubmitAnswer(gameName, gameId, playerId, data.answer);
    default:
      utils.firebase.throwException(`Given action ${action} is not allowed`, action);
  }
};
