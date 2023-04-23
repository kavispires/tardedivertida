// Constants
import { GAME_NAMES } from '../../utils/constants';
import {
  CONTADORES_HISTORIAS_ACTIONS,
  CONTADORES_HISTORIAS_PHASES,
  MAX_ROUNDS,
  PLAYER_COUNTS,
} from './constants';
// Types
import type {
  ContadoresHistoriasInitialState,
  ContadoresHistoriasOptions,
  ContadoresHistoriasSubmitAction,
  FirebaseStateData,
  FirebaseStoreData,
} from './types';
// Utils
import utils from '../../utils';
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
import { getData } from './data';

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
  return utils.helpers.getDefaultInitialState<ContadoresHistoriasInitialState>({
    gameId,
    gameName: GAME_NAMES.CONTADORES_HISTORIAS,
    uid,
    language,
    playerCounts: PLAYER_COUNTS,
    initialPhase: CONTADORES_HISTORIAS_PHASES.LOBBY,
    totalRounds: MAX_ROUNDS,
    store: {
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
  gameName: string,
  gameId: string,
  currentState?: FirebaseStateData
): Promise<boolean> => {
  const { sessionRef, state, store, players } = await utils.firebase.getStateAndStoreReferences<
    FirebaseStateData,
    FirebaseStoreData
  >(gameName, gameId, 'prepare next phase', currentState);

  // Determine if it's game over
  const isGameOver = determineGameOver(players, store.options, state.round);
  // Determine next phase
  const nextPhase = determineNextPhase(state?.phase, state?.round, isGameOver);

  // RULES -> SETUP
  if (nextPhase === CONTADORES_HISTORIAS_PHASES.SETUP) {
    // Enter setup phase before doing anything
    await utils.firebase.triggerSetupPhase(sessionRef);

    // Request data
    const additionalData = await getData(utils.players.getPlayerCount(players), store.options.originalDecks);

    const newPhase = await prepareSetupPhase(store, state, players, additionalData);
    await utils.firebase.saveGame(sessionRef, newPhase);

    return getNextPhase(gameName, gameId);
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
    const newPhase = await prepareGameOverPhase(gameId, store, state, players);
    return utils.firebase.saveGame(sessionRef, newPhase);
  }

  return true;
};

/**
 * Handles question and answers submissions
 * May trigger next phase
 */
export const submitAction = async (data: ContadoresHistoriasSubmitAction) => {
  const { gameId, gameName, playerId, action } = data;

  utils.firebase.validateSubmitActionPayload(gameId, gameName, playerId, action);

  switch (action) {
    case CONTADORES_HISTORIAS_ACTIONS.SUBMIT_STORY:
      utils.firebase.validateSubmitActionProperties(data, ['story', 'cardId'], 'submit story');
      return handleSubmitStory(gameName, gameId, playerId, data.story, data.cardId);
    case CONTADORES_HISTORIAS_ACTIONS.PLAY_CARD:
      utils.firebase.validateSubmitActionProperties(data, ['cardId'], 'play card');
      return handlePlayCard(gameName, gameId, playerId, data.cardId);
    case CONTADORES_HISTORIAS_ACTIONS.SUBMIT_VOTE:
      utils.firebase.validateSubmitActionProperties(data, ['vote'], 'submit vote');
      return handleSubmitVote(gameName, gameId, playerId, data.vote);
    default:
      utils.firebase.throwException(`Given action ${action} is not allowed`);
  }
};
