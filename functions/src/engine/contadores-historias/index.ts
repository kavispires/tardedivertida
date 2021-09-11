// Constants
import { GAME_COLLECTIONS, GAME_PLAYERS_LIMIT } from '../../utils/constants';
import { CONTADORES_HISTORIAS_PHASES } from './constants';
// Interfaces
import { GameId, Language, Players } from '../../utils/interfaces';
// Utils
import * as firebaseUtils from '../../utils/firebase';
import { determineGameOver, determineNextPhase } from './helpers';
import { ContadoresHistoriasInitialState, ContadoresHistoriasSubmitAction } from './interfaces';
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
): ContadoresHistoriasInitialState => ({
  meta: {
    gameId,
    gameName: GAME_COLLECTIONS.CONTADORES_HISTORIAS,
    createdAt: Date.now(),
    createdBy: uid,
    min: GAME_PLAYERS_LIMIT.CONTADORES_HISTORIAS.min,
    max: GAME_PLAYERS_LIMIT.CONTADORES_HISTORIAS.max,
    isLocked: false,
    isComplete: false,
    language,
    replay: 0,
  },
  players: {},
  store: {
    language,
    gameOrder: [],
    tableDeck: [],
    deckIndex: -1,
  },
  state: {
    phase: CONTADORES_HISTORIAS_PHASES.LOBBY,
    round: {
      current: 0,
      total: 0,
    },
  },
});

export const nextContadoresHistoriasPhase = async (
  collectionName: string,
  gameId: string,
  players: Players
): Promise<boolean> => {
  const actionText = 'prepare next phase';

  // Gather docs and references
  const sessionRef = firebaseUtils.getSessionRef(collectionName, gameId);
  const stateDoc = await firebaseUtils.getSessionDoc(collectionName, gameId, 'state', actionText);
  const storeDoc = await firebaseUtils.getSessionDoc(collectionName, gameId, 'store', actionText);

  const state = stateDoc.data() ?? {};
  const store = { ...(storeDoc.data() ?? {}) };

  // Determine if it's game over
  const isGameOver = determineGameOver(players);
  // Determine next phase
  const nextPhase = determineNextPhase(state?.phase, state?.round, isGameOver);

  // RULES -> SETUP
  if (nextPhase === CONTADORES_HISTORIAS_PHASES.SETUP) {
    const newPhase = await prepareSetupPhase(store, state, players);
    await firebaseUtils.saveGame(sessionRef, newPhase);
    const playersDoc = await firebaseUtils.getSessionDoc(collectionName, gameId, 'players', actionText);
    const newPlayers = playersDoc.data() ?? {};
    return nextContadoresHistoriasPhase(collectionName, gameId, newPlayers);
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

  // RESOLUTION --> GAME_OVER
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

  const actionText = 'submit action';
  firebaseUtils.verifyPayload(gameId, 'gameId', actionText);
  firebaseUtils.verifyPayload(collectionName, 'collectionName', actionText);
  firebaseUtils.verifyPayload(playerId, 'playerId', actionText);
  firebaseUtils.verifyPayload(action, 'action', actionText);

  switch (action) {
    case 'SUBMIT_STORY':
      if (!data.story) {
        firebaseUtils.throwException('Missing `story` value', 'submit story');
      }
      if (!data.cardId) {
        firebaseUtils.throwException('Missing `cardId` value', 'submit story');
      }
      return handleSubmitStory(collectionName, gameId, playerId, data.story, data.cardId);
    case 'PLAY_CARD':
      if (!data.cardId) {
        firebaseUtils.throwException('Missing `cardId` value', 'play card');
      }
      return handlePlayCard(collectionName, gameId, playerId, data.cardId);
    case 'SUBMIT_VOTE':
      if (!data.vote) {
        firebaseUtils.throwException('Missing `vote` value', 'submit vote');
      }
      return handleSubmitVote(collectionName, gameId, playerId, data.vote);
    default:
      firebaseUtils.throwException(`Given action ${action} is not allowed`);
  }
};
