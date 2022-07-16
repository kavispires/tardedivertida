// Constants
import { GAME_COLLECTIONS } from '../../utils/constants';
import { MAX_ROUNDS, PLAYER_COUNTS, POLEMICA_DA_VEZ_PHASES } from './constants';
// Types
import type { GameId, Language, Players } from '../../utils/types';
import type { PolemicaDaVezInitialState, PolemicaDaVezOptions, PolemicaDaVezSubmitAction } from './types';
// Utils
import * as utils from '../../utils';
// Internal Functions
import { determineGameOver, determineNextPhase } from './helpers';
import { getTopics } from './data';
import {
  prepareSetupPhase,
  prepareGameOverPhase,
  prepareReactPhase,
  prepareResolutionPhase,
  prepareTopicSelectionPhase,
} from './setup';
import { handleSubmitReaction, handleSubmitTopic } from './actions';

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
  options: PolemicaDaVezOptions
): PolemicaDaVezInitialState => {
  return utils.helpers.getDefaultInitialState({
    gameId,
    gameName: GAME_COLLECTIONS.POLEMICA_DA_VEZ,
    uid,
    language,
    playerCounts: PLAYER_COUNTS,
    initialPhase: POLEMICA_DA_VEZ_PHASES.LOBBY,
    totalRounds: MAX_ROUNDS,
    store: {
      language,
      pastTopics: [],
      gameOrder: [],
    },
    options,
  });
};

/**
 * Exposes min and max player count
 */
export const playerCounts = PLAYER_COUNTS;

export const getNextPhase = async (
  collectionName: string,
  gameId: string,
  players: Players
): Promise<boolean> => {
  const { sessionRef, state, store } = await utils.firebase.getStateAndStoreReferences(
    collectionName,
    gameId,
    'prepare next phase'
  );

  // Determine if it's game over
  const isGameOver = determineGameOver(players, store.options, state.round);
  // Determine next phase
  const nextPhase = determineNextPhase(state?.phase, state.round, isGameOver, state?.lastRound);

  // RULES -> SETUP
  if (nextPhase === POLEMICA_DA_VEZ_PHASES.SETUP) {
    // Enter setup phase before doing anything
    await utils.firebase.triggerSetupPhase(sessionRef);

    // Request data
    const additionalData = await getTopics(store.language);
    const newPhase = await prepareSetupPhase(store, state, players, additionalData);
    await utils.firebase.saveGame(sessionRef, newPhase);
    return getNextPhase(collectionName, gameId, players);
  }

  // * -> TOPIC_SELECTION
  if (nextPhase === POLEMICA_DA_VEZ_PHASES.TOPIC_SELECTION) {
    const newPhase = await prepareTopicSelectionPhase(store, state, players);
    return utils.firebase.saveGame(sessionRef, newPhase);
  }

  // TOPIC_SELECTION -> REACT
  if (nextPhase === POLEMICA_DA_VEZ_PHASES.REACT) {
    const newPhase = await prepareReactPhase(store, state, players);
    return utils.firebase.saveGame(sessionRef, newPhase);
  }

  // REACT -> RESOLUTION
  if (nextPhase === POLEMICA_DA_VEZ_PHASES.RESOLUTION) {
    const newPhase = await prepareResolutionPhase(store, state, players);
    return utils.firebase.saveGame(sessionRef, newPhase);
  }

  // RESOLUTION --> GAME_OVER
  if (nextPhase === POLEMICA_DA_VEZ_PHASES.GAME_OVER) {
    const newPhase = await prepareGameOverPhase(store, state, players);
    return utils.firebase.saveGame(sessionRef, newPhase);
  }

  return true;
};

/**
 * Perform action submitted by the app
 * @param data
 * @returns
 */
export const submitAction = async (data: PolemicaDaVezSubmitAction) => {
  const { gameId, gameName: collectionName, playerId, action } = data;

  utils.firebase.validateSubmitActionPayload(gameId, collectionName, playerId, action);

  switch (action) {
    case 'SUBMIT_TOPIC':
      utils.firebase.validateSubmitActionProperties(data, ['topicId'], 'submit topic');
      return handleSubmitTopic(collectionName, gameId, playerId, data.topicId, data?.customTopic);
    case 'SUBMIT_REACTION':
      utils.firebase.validateSubmitActionProperties(data, ['reaction', 'likesGuess'], 'submit reaction');
      return handleSubmitReaction(collectionName, gameId, playerId, data.reaction, data.likesGuess);
    default:
      utils.firebase.throwException(`Given action ${action} is not allowed`);
  }
};
