// Constants
import { GAME_COLLECTIONS } from '../../utils/constants';
import { CONTADORES_HISTORIAS_PHASES, MAX_ROUNDS, PLAYER_COUNTS } from './constants';
// Types
import type { GameId, Language, Players } from '../../utils/types';
import type {
  ContadoresHistoriasInitialState,
  ContadoresHistoriasOptions,
  ContadoresHistoriasSubmitAction,
} from './types';
// Utils
import * as utils from '../../utils';
// Internal Functions
import { determineGameOver, determineNextPhase } from './helpers';
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
  language: Language,
  options: ContadoresHistoriasOptions
): ContadoresHistoriasInitialState => {
  return utils.helpers.getDefaultInitialState({
    gameId,
    gameName: GAME_COLLECTIONS.CONTADORES_HISTORIAS,
    uid,
    language,
    playerCounts: PLAYER_COUNTS,
    initialPhase: CONTADORES_HISTORIAS_PHASES.LOBBY,
    totalRounds: MAX_ROUNDS,
    store: {
      language,
      gameOrder: [],
      tableDeck: [],
      deckIndex: -1,
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
  const actionText = 'prepare next phase';

  // Gather docs and references
  const { sessionRef, state, store } = await utils.firebase.getStateAndStoreReferences(
    collectionName,
    gameId,
    actionText
  );

  // Determine if it's game over
  const isGameOver = determineGameOver(players, store.options, state.round);
  // Determine next phase
  const nextPhase = determineNextPhase(state?.phase, state?.round, isGameOver, state?.lastRound);

  // RULES -> SETUP
  if (nextPhase === CONTADORES_HISTORIAS_PHASES.SETUP) {
    // Enter setup phase before doing anything
    await utils.firebase.triggerSetupPhase(sessionRef);

    const newPhase = await prepareSetupPhase(store, state, players);
    await utils.firebase.saveGame(sessionRef, newPhase);

    return getNextPhase(collectionName, gameId, newPhase.update?.players ?? {});
  }

  // * -> STORY
  if (nextPhase === CONTADORES_HISTORIAS_PHASES.STORY) {
    const newPhase = await prepareStoryPhase(store, state, players);
    return utils.firebase.saveGame(sessionRef, newPhase);
  }

  // STORY -> CARD_PLAY
  if (nextPhase === CONTADORES_HISTORIAS_PHASES.CARD_PLAY) {
    const newPhase = await prepareCardPlayPhase(store, state, players);
    return utils.firebase.saveGame(sessionRef, newPhase);
  }

  // CARD_PLAY -> VOTING
  if (nextPhase === CONTADORES_HISTORIAS_PHASES.VOTING) {
    const newPhase = await prepareVotingPhase(store, state, players);
    return utils.firebase.saveGame(sessionRef, newPhase);
  }

  // VOTING -> RESOLUTION
  if (nextPhase === CONTADORES_HISTORIAS_PHASES.RESOLUTION) {
    const newPhase = await prepareResolutionPhase(store, state, players);
    return utils.firebase.saveGame(sessionRef, newPhase);
  }

  // RESOLUTION -> GAME_OVER
  if (nextPhase === CONTADORES_HISTORIAS_PHASES.GAME_OVER) {
    const newPhase = await prepareGameOverPhase(store, state, players);
    return utils.firebase.saveGame(sessionRef, newPhase);
  }

  return true;
};

/**
 * Handles question and answers submissions
 * May trigger next phase
 */
export const submitAction = async (data: ContadoresHistoriasSubmitAction) => {
  const { gameId, gameName: collectionName, playerId, action } = data;

  utils.firebase.validateSubmitActionPayload(gameId, collectionName, playerId, action);

  switch (action) {
    case 'SUBMIT_STORY':
      utils.firebase.validateSubmitActionProperties(data, ['story', 'cardId'], 'submit story');
      return handleSubmitStory(collectionName, gameId, playerId, data.story, data.cardId);
    case 'PLAY_CARD':
      utils.firebase.validateSubmitActionProperties(data, ['cardId'], 'play card');
      return handlePlayCard(collectionName, gameId, playerId, data.cardId);
    case 'SUBMIT_VOTE':
      utils.firebase.validateSubmitActionProperties(data, ['vote'], 'submit vote');
      return handleSubmitVote(collectionName, gameId, playerId, data.vote);
    default:
      utils.firebase.throwException(`Given action ${action} is not allowed`);
  }
};
