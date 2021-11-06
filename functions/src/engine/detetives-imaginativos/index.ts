// Constants
import { GAME_COLLECTIONS } from '../../utils/constants';
import { DETETIVES_IMAGINATIVOS_PHASES, PLAYER_COUNT } from './constants';
// Interfaces
import { GameId, Language, Players } from '../../utils/interfaces';
import { DetetivesImaginativosInitialState, DetetivesImaginativosSubmitAction } from './interfaces';
// Utils
import * as firebaseUtils from '../../utils/firebase';
import * as utils from '../../utils/helpers';
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
  language: Language
): DetetivesImaginativosInitialState => {
  return utils.getDefaultInitialState({
    gameId,
    gameName: GAME_COLLECTIONS.DETETIVES_IMAGINATIVOS,
    uid,
    language,
    playerCount: PLAYER_COUNT,
    initialPhase: DETETIVES_IMAGINATIVOS_PHASES.LOBBY,
    totalRounds: 0,
    store: {
      language,
      usedCards: [],
      gameOrder: [],
      turnOrder: [],
    },
  });
};

export const nextDetetivesImaginativosPhase = async (
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

  // Determine next phase
  const nextPhase = determineNextPhase(state?.phase, state?.round);

  // RULES -> SETUP
  if (nextPhase === DETETIVES_IMAGINATIVOS_PHASES.SETUP) {
    // Enter setup phase before doing anything
    await firebaseUtils.triggerSetupPhase(sessionRef);

    const newPhase = await prepareSetupPhase(store, state, players);
    await firebaseUtils.saveGame(sessionRef, newPhase);

    return nextDetetivesImaginativosPhase(collectionName, gameId, newPhase.update?.players ?? {});
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

  firebaseUtils.validateSubmitActionPayload(gameId, collectionName, playerId, action);

  switch (action) {
    case 'SUBMIT_CLUE':
      firebaseUtils.validateSubmitActionProperties(data, ['clue'], 'submit clue');
      return handleSubmitClue(collectionName, gameId, playerId, data.clue);
    case 'PLAY_CARD':
      firebaseUtils.validateSubmitActionProperties(data, ['cardId'], 'play card');
      return handlePlayCard(collectionName, gameId, playerId, data.cardId);
    case 'DEFEND':
      return handleDefend(collectionName, gameId, playerId);
    case 'SUBMIT_VOTE':
      firebaseUtils.validateSubmitActionProperties(data, ['vote'], 'submit vote');
      return handleSubmitVote(collectionName, gameId, playerId, data.vote);
    default:
      firebaseUtils.throwException(`Given action ${action} is not allowed`);
  }
};
