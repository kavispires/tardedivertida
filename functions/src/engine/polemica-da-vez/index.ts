// Constants
import { GAME_COLLECTIONS } from '../../utils/constants';
import { MAX_ROUNDS, PLAYER_COUNT, POLEMICA_DA_VEZ_PHASES } from './constants';
// Interfaces
import { GameId, Language, Players } from '../../utils/interfaces';
import { PolemicaDaVezInitialState, PolemicaDaVezSubmitAction } from './interfaces';
// Utils
import * as firebaseUtils from '../../utils/firebase';
import * as utils from '../../utils/helpers';
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
  language: Language
): PolemicaDaVezInitialState => {
  return utils.getDefaultInitialState({
    gameId,
    gameName: GAME_COLLECTIONS.POLEMICA_DA_VEZ,
    uid,
    language,
    playerCount: PLAYER_COUNT,
    initialPhase: POLEMICA_DA_VEZ_PHASES.LOBBY,
    totalRounds: MAX_ROUNDS,
    store: {
      language,
      usedTopics: [],
      gameOrder: [],
    },
  });
};

export const nextPolemicaDaVezPhase = async (
  collectionName: string,
  gameId: string,
  players: Players
): Promise<boolean> => {
  const { sessionRef, state, store } = await firebaseUtils.getStateAndStoreReferences(
    collectionName,
    gameId,
    'prepare next phase'
  );

  // Determine if it's game over
  const isGameOver = determineGameOver(players);
  // Determine next phase
  const nextPhase = determineNextPhase(state?.phase, state.round.current, isGameOver);

  // RULES -> SETUP
  if (nextPhase === POLEMICA_DA_VEZ_PHASES.SETUP) {
    // Request data
    const additionalData = await getTopics(store.language);
    const newPhase = await prepareSetupPhase(store, state, players, additionalData);
    await firebaseUtils.saveGame(sessionRef, newPhase);
    return nextPolemicaDaVezPhase(collectionName, gameId, players);
  }

  // * -> TOPIC_SELECTION
  if (nextPhase === POLEMICA_DA_VEZ_PHASES.TOPIC_SELECTION) {
    const newPhase = await prepareTopicSelectionPhase(store, state, players);
    return firebaseUtils.saveGame(sessionRef, newPhase);
  }

  // TOPIC_SELECTION -> REACT
  if (nextPhase === POLEMICA_DA_VEZ_PHASES.REACT) {
    const newPhase = await prepareReactPhase(store, state, players);
    return firebaseUtils.saveGame(sessionRef, newPhase);
  }

  // REACT -> RESOLUTION
  if (nextPhase === POLEMICA_DA_VEZ_PHASES.RESOLUTION) {
    const newPhase = await prepareResolutionPhase(store, state, players);
    return firebaseUtils.saveGame(sessionRef, newPhase);
  }

  // RESOLUTION --> GAME_OVER
  if (nextPhase === POLEMICA_DA_VEZ_PHASES.GAME_OVER) {
    const newPhase = await prepareGameOverPhase(store, state, players);
    return firebaseUtils.saveGame(sessionRef, newPhase);
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

  firebaseUtils.validateSubmitActionPayload(gameId, collectionName, playerId, action);

  switch (action) {
    case 'SUBMIT_TOPIC':
      if (!data.topicId) {
        firebaseUtils.throwException('Missing `topicId` value', 'submit topic');
      }
      return handleSubmitTopic(collectionName, gameId, playerId, data.topicId, data?.customTopic);
    case 'SUBMIT_REACTION':
      if (data.reaction === undefined) {
        firebaseUtils.throwException('Missing `reaction` value', 'submit reaction');
      }
      if (data.likesGuess === undefined) {
        firebaseUtils.throwException('Missing `likesGuess` value', 'submit reaction');
      }
      return handleSubmitReaction(collectionName, gameId, playerId, data.reaction, data.likesGuess);
    default:
      firebaseUtils.throwException(`Given action ${action} is not allowed`);
  }
};
