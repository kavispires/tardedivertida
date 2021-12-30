// Constants
import { GAME_COLLECTIONS } from '../../utils/constants';
import { CONTADORES_HISTORIAS_PHASES, MAX_ROUNDS, PLAYER_COUNT } from './constants';
// Types
import { GameId, Language, Players } from '../../utils/types';
// Utils
import * as firebaseUtils from '../../utils/firebase';
import * as utils from '../../utils/helpers';
// Internal Functions
import { determineGameOver, determineNextPhase } from './helpers';
import { ContadoresHistoriasInitialState, ContadoresHistoriasSubmitAction } from './types';
import {
  prepareCardPlayPhase,
  prepareGameOverPhase,
  prepareResolutionPhase,
  prepareSetupPhase,
  prepareStoryPhase,
  prepareVotingPhase,
} from './setup';
import { handlePlayCard, handleSubmitStory, handleSubmitVote } from './actions';

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
): ContadoresHistoriasInitialState => {
  return utils.getDefaultInitialState({
    gameId,
    gameName: GAME_COLLECTIONS.CONTADORES_HISTORIAS,
    uid,
    language,
    playerCount: PLAYER_COUNT,
    initialPhase: CONTADORES_HISTORIAS_PHASES.LOBBY,
    totalRounds: MAX_ROUNDS,
    store: {
      language,
      gameOrder: [],
      tableDeck: [],
      deckIndex: -1,
    },
  });
};

/**
 * Exposes min and max player count
 */
export const playerCount = PLAYER_COUNT;

export const getNextPhase = async (
  collectionName: string,
  gameId: string,
  players: Players
): Promise<boolean> => {
  const actionText = 'prepare next phase';

  // Gather docs and references
  const { sessionRef, state, store } = await firebaseUtils.getStateAndStoreReferences(
    collectionName,
    gameId,
    actionText
  );

  // Determine if it's game over
  const isGameOver = determineGameOver(players);
  // Determine next phase
  const nextPhase = determineNextPhase(state?.phase, state?.round, isGameOver, state?.lastRound);

  // RULES -> SETUP
  if (nextPhase === CONTADORES_HISTORIAS_PHASES.SETUP) {
    // Enter setup phase before doing anything
    await firebaseUtils.triggerSetupPhase(sessionRef);

    const newPhase = await prepareSetupPhase(store, state, players);
    await firebaseUtils.saveGame(sessionRef, newPhase);

    return getNextPhase(collectionName, gameId, newPhase.update?.players ?? {});
  }

  // * -> STORY
  if (nextPhase === CONTADORES_HISTORIAS_PHASES.STORY) {
    const newPhase = await prepareStoryPhase(store, state, players);
    return firebaseUtils.saveGame(sessionRef, newPhase);
  }

  // STORY -> CARD_PLAY
  if (nextPhase === CONTADORES_HISTORIAS_PHASES.CARD_PLAY) {
    const newPhase = await prepareCardPlayPhase(store, state, players);
    return firebaseUtils.saveGame(sessionRef, newPhase);
  }

  // CARD_PLAY -> VOTING
  if (nextPhase === CONTADORES_HISTORIAS_PHASES.VOTING) {
    const newPhase = await prepareVotingPhase(store, state, players);
    return firebaseUtils.saveGame(sessionRef, newPhase);
  }

  // VOTING -> RESOLUTION
  if (nextPhase === CONTADORES_HISTORIAS_PHASES.RESOLUTION) {
    const newPhase = await prepareResolutionPhase(store, state, players);
    return firebaseUtils.saveGame(sessionRef, newPhase);
  }

  // RESOLUTION -> GAME_OVER
  if (nextPhase === CONTADORES_HISTORIAS_PHASES.GAME_OVER) {
    const newPhase = await prepareGameOverPhase(store, state, players);
    return firebaseUtils.saveGame(sessionRef, newPhase);
  }

  return true;
};

/**
 * Handles question and answers submissions
 * May trigger next phase
 */
export const submitAction = async (data: ContadoresHistoriasSubmitAction) => {
  const { gameId, gameName: collectionName, playerId, action } = data;

  firebaseUtils.validateSubmitActionPayload(gameId, collectionName, playerId, action);

  switch (action) {
    case 'SUBMIT_STORY':
      firebaseUtils.validateSubmitActionProperties(data, ['story', 'cardId'], 'submit story');
      return handleSubmitStory(collectionName, gameId, playerId, data.story, data.cardId);
    case 'PLAY_CARD':
      firebaseUtils.validateSubmitActionProperties(data, ['cardId'], 'play card');
      return handlePlayCard(collectionName, gameId, playerId, data.cardId);
    case 'SUBMIT_VOTE':
      firebaseUtils.validateSubmitActionProperties(data, ['vote'], 'submit vote');
      return handleSubmitVote(collectionName, gameId, playerId, data.vote);
    default:
      firebaseUtils.throwException(`Given action ${action} is not allowed`);
  }
};
