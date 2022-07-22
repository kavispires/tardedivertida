// Constants
import { GAME_COLLECTIONS } from '../../utils/constants';
import { DETETIVES_IMAGINATIVOS_PHASES, PLAYER_COUNTS } from './constants';
// Types
import type { DetetivesImaginativosInitialState, DetetivesImaginativosSubmitAction } from './types';
// Utils
import * as utils from '../../utils';
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
  return utils.helpers.getDefaultInitialState({
    gameId,
    gameName: GAME_COLLECTIONS.DETETIVES_IMAGINATIVOS,
    uid,
    language,
    playerCounts: PLAYER_COUNTS,
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

/**
 * Exposes min and max player count
 */
export const playerCounts = PLAYER_COUNTS;

export const getNextPhase = async (
  collectionName: string,
  gameId: string,
  players: Players
): Promise<boolean> => {
  const actionText = 'prepare next phase';

  // Gather docs and references
  const { sessionRef, state, store } = await utils.firebase.getStateAndStoreReferences(
    collectionName,
    gameId,
    actionText
  );

  // Determine next phase
  const nextPhase = determineNextPhase(state?.phase, state?.round, state?.lastRound);

  // RULES -> SETUP
  if (nextPhase === DETETIVES_IMAGINATIVOS_PHASES.SETUP) {
    // Enter setup phase before doing anything
    await utils.firebase.triggerSetupPhase(sessionRef);

    const newPhase = await prepareSetupPhase(store, state, players);
    await utils.firebase.saveGame(sessionRef, newPhase);

    return getNextPhase(collectionName, gameId, newPhase.update?.players ?? {});
  }

  // * -> SECRET_CLUE
  if (nextPhase === DETETIVES_IMAGINATIVOS_PHASES.SECRET_CLUE) {
    const newPhase = await prepareSecretCluePhase(store, state, players);
    return utils.firebase.saveGame(sessionRef, newPhase);
  }

  // SECRET_CLUE -> CARD_PLAY
  if (nextPhase === DETETIVES_IMAGINATIVOS_PHASES.CARD_PLAY) {
    const newPhase = await prepareCardPlayPhase(store, state, players);
    return utils.firebase.saveGame(sessionRef, newPhase);
  }

  // CARD_PLAY -> DEFENSE
  if (nextPhase === DETETIVES_IMAGINATIVOS_PHASES.DEFENSE) {
    const newPhase = await prepareDefensePhase(store, state, players);
    return utils.firebase.saveGame(sessionRef, newPhase);
  }

  // DEFENSE -> VOTING
  if (nextPhase === DETETIVES_IMAGINATIVOS_PHASES.VOTING) {
    const newPhase = await prepareVotingPhase(store, state, players);
    return utils.firebase.saveGame(sessionRef, newPhase);
  }

  // VOTING -> REVEAL
  if (nextPhase === DETETIVES_IMAGINATIVOS_PHASES.REVEAL) {
    const newPhase = await prepareRevealPhase(store, state, players);
    return utils.firebase.saveGame(sessionRef, newPhase);
  }

  // REVEAL --> GAME_OVER
  if (nextPhase === DETETIVES_IMAGINATIVOS_PHASES.GAME_OVER) {
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
export const submitAction = async (data: DetetivesImaginativosSubmitAction) => {
  const { gameId, gameName: collectionName, playerId, action } = data;

  utils.firebase.validateSubmitActionPayload(gameId, collectionName, playerId, action);

  switch (action) {
    case 'SUBMIT_CLUE':
      utils.firebase.validateSubmitActionProperties(data, ['clue'], 'submit clue');
      return handleSubmitClue(collectionName, gameId, playerId, data.clue);
    case 'PLAY_CARD':
      utils.firebase.validateSubmitActionProperties(data, ['cardId'], 'play card');
      return handlePlayCard(collectionName, gameId, playerId, data.cardId);
    case 'DEFEND':
      return handleDefend(collectionName, gameId, playerId);
    case 'SUBMIT_VOTE':
      utils.firebase.validateSubmitActionProperties(data, ['vote'], 'submit vote');
      return handleSubmitVote(collectionName, gameId, playerId, data.vote);
    default:
      utils.firebase.throwException(`Given action ${action} is not allowed`);
  }
};
