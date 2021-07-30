// Constants
import { GAME_COLLECTIONS, GAME_PLAYERS_LIMIT } from '../../utils/constants';
import { DETETIVES_IMAGINATIVOS_PHASES } from './constants';
// Interfaces
import { GameId, Players } from '../../utils/interfaces';
import { DetetivesImaginativosInitialState, DetetivesImaginativosSubmitAction } from './interfaces';
// Utils
import * as firebaseUtils from '../../utils/firebase';
import {
  prepareCardPlayPhase,
  prepareDefensePhase,
  prepareGameOverPhase,
  prepareRevealPhase,
  prepareSecretCluePhase,
  prepareSetupPhase,
  prepareVotingPhase,
} from './setup';
import { handleDefend, handlePlayCard, handleSubmitClue, handleSubmitVote } from './actions';
import { determineNextPhase } from './helpers';

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
  language: string
): DetetivesImaginativosInitialState => ({
  meta: {
    gameId,
    gameName: GAME_COLLECTIONS.DETETIVES_IMAGINATIVOS,
    createdAt: Date.now(),
    createdBy: uid,
    min: GAME_PLAYERS_LIMIT.DETETIVES_IMAGINATIVOS.min,
    max: GAME_PLAYERS_LIMIT.DETETIVES_IMAGINATIVOS.max,
    isLocked: false,
    isComplete: false,
    language,
    replay: 0,
  },
  players: {},
  store: {
    usedCards: [],
    gameOrder: [],
    turnOrder: [],
  },
  state: {
    phase: DETETIVES_IMAGINATIVOS_PHASES.LOBBY,
    round: {
      current: 0,
      total: 0,
    },
  },
});

export const nextDetetivesImaginativosPhase = async (
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

  // Determine next phase
  const nextPhase = determineNextPhase(state?.phase, state?.round);

  // RULES -> SETUP
  if (nextPhase === DETETIVES_IMAGINATIVOS_PHASES.SETUP) {
    const newPhase = await prepareSetupPhase(store, state, players);
    await firebaseUtils.saveGame(sessionRef, newPhase);
    const playersDoc = await firebaseUtils.getSessionDoc(collectionName, gameId, 'players', actionText);
    const newPlayers = playersDoc.data() ?? {};
    console.log(newPlayers);
    return nextDetetivesImaginativosPhase(collectionName, gameId, newPlayers);
  }

  // * -> SECRET_CLUE
  if (nextPhase === DETETIVES_IMAGINATIVOS_PHASES.SECRET_CLUE) {
    const newPhase = await prepareSecretCluePhase(store, state, players);
    return firebaseUtils.saveGame(sessionRef, newPhase);
  }

  // SECRET_CLUE -> CARD_PLAY
  if (nextPhase === DETETIVES_IMAGINATIVOS_PHASES.CARD_PLAY) {
    const newPhase = await prepareCardPlayPhase(store, state, players);
    return firebaseUtils.saveGame(sessionRef, newPhase);
  }

  // CARD_PLAY -> DEFENSE
  if (nextPhase === DETETIVES_IMAGINATIVOS_PHASES.DEFENSE) {
    const newPhase = await prepareDefensePhase(store, state, players);
    return firebaseUtils.saveGame(sessionRef, newPhase);
  }

  // DEFENSE -> VOTING
  if (nextPhase === DETETIVES_IMAGINATIVOS_PHASES.VOTING) {
    const newPhase = await prepareVotingPhase(store, state, players);
    return firebaseUtils.saveGame(sessionRef, newPhase);
  }

  // VOTING -> REVEAL
  if (nextPhase === DETETIVES_IMAGINATIVOS_PHASES.REVEAL) {
    const newPhase = await prepareRevealPhase(store, state, players);
    return firebaseUtils.saveGame(sessionRef, newPhase);
  }

  // REVEAL --> GAME_OVER
  if (nextPhase === DETETIVES_IMAGINATIVOS_PHASES.GAME_OVER) {
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
export const submitAction = async (data: DetetivesImaginativosSubmitAction) => {
  const { gameId, gameName: collectionName, playerId, action } = data;

  const actionText = 'submit action';
  firebaseUtils.verifyPayload(gameId, 'gameId', actionText);
  firebaseUtils.verifyPayload(collectionName, 'collectionName', actionText);
  firebaseUtils.verifyPayload(playerId, 'playerId', actionText);
  firebaseUtils.verifyPayload(action, 'action', actionText);

  switch (action) {
    case 'SUBMIT_CLUE':
      if (!data.clue) {
        firebaseUtils.throwException('Missing `clue` value', 'submit clue');
      }
      return handleSubmitClue(collectionName, gameId, playerId, data.clue);
    case 'PLAY_CARD':
      if (!data.cardId) {
        firebaseUtils.throwException('Missing `cardId` value', 'play card');
      }
      return handlePlayCard(collectionName, gameId, playerId, data.cardId);
    case 'DEFEND':
      return handleDefend(collectionName, gameId, playerId);
    case 'SUBMIT_VOTE':
      if (!data.vote) {
        firebaseUtils.throwException('Missing `vote` value', 'submit vote');
      }
      return handleSubmitVote(collectionName, gameId, playerId, data.vote);
    default:
      firebaseUtils.throwException(`Given action ${action} is not allowed`);
  }
};
