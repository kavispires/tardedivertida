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
import { handleSubmitAnswer, handleSubmitGuesses, handleSubmitPrompt, handleSubmitIdentity } from './actions';
import {
  prepareSetupPhase,
  prepareGameOverPhase,
  prepareAnsweringPhase,
  prepareGuessingPhase,
  prepareRevealPhase,
  prepareIdentitySelectionPhase,
  preparePromptingPhase,
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
  const playerCount = utils.players.getPlayerCount(players);

  // Determine next phase
  const nextPhase = determineNextPhase(state as TaNaCaraState, playerCount);

  // LOBBY -> SETUP
  if (nextPhase === TA_NA_CARA_PHASES.SETUP) {
    // Enter setup phase before doing anything
    await utils.firestore.triggerSetupPhase(sessionRef);

    // Request data
    const additionalData = await getResourceData(store.language, playerCount, store.options);
    const newPhase = await prepareSetupPhase(store, state, players, additionalData);
    await utils.firestore.saveGame(sessionRef, newPhase);
    return getNextPhase(gameName, gameId);
  }

  // * -> IDENTITY_SELECTION
  if (nextPhase === TA_NA_CARA_PHASES.IDENTITY_SELECTION) {
    const newPhase = await prepareIdentitySelectionPhase(store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  // IDENTITY_SELECTION/ANSWERING/REVEAL -> PROMPTING
  if (nextPhase === TA_NA_CARA_PHASES.PROMPTING) {
    const newPhase = await preparePromptingPhase(store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  // PROMPTING -> ANSWERING
  if (nextPhase === TA_NA_CARA_PHASES.ANSWERING) {
    const newPhase = await prepareAnsweringPhase(store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  // ANSWERING -> GUESSING
  if (nextPhase === TA_NA_CARA_PHASES.GUESSING) {
    const newPhase = await prepareGuessingPhase(store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  // GUESSING -> REVEAL
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
    case TA_NA_CARA_ACTIONS.SUBMIT_IDENTITY:
      utils.firebase.validateSubmitActionProperties(data, ['identityId'], 'submit identity');
      return handleSubmitIdentity(gameName, gameId, playerId, data.identityId);
    case TA_NA_CARA_ACTIONS.SUBMIT_PROMPT:
      utils.firebase.validateSubmitActionProperties(
        data,
        ['questionId', 'customQuestion', 'customAnswer'],
        'submit prompt',
      );
      return handleSubmitPrompt(
        gameName,
        gameId,
        playerId,
        data.questionId,
        data.customQuestion,
        data.customAnswer,
      );
    case TA_NA_CARA_ACTIONS.SUBMIT_ANSWER:
      utils.firebase.validateSubmitActionProperties(data, ['questionId', 'answer'], 'submit answer');
      return handleSubmitAnswer(gameName, gameId, playerId, data.questionId, data.answer);
    case TA_NA_CARA_ACTIONS.SUBMIT_GUESSES:
      utils.firebase.validateSubmitActionProperties(data, ['guesses'], 'submit guesses');
      return handleSubmitGuesses(gameName, gameId, playerId, data.guesses);
    default:
      utils.firebase.throwException(`Given action ${action} is not allowed`, action);
  }
};
