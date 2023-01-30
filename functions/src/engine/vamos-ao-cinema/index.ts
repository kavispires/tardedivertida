// Constants
import { GAME_NAMES } from '../../utils/constants';
import { VAMOS_AO_CINEMA_ACTIONS, VAMOS_AO_CINEMA_PHASES, PLAYER_COUNTS, TOTAL_ROUNDS } from './constants';
// Types
import type { VamosAoCinemaInitialState, VamosAoCinemaOptions, VamosAoCinemaSubmitAction } from './types';
// Utils
import utils from '../../utils';
// Internal Functions
import { determineOutcome, determineNextPhase } from './helpers';
import {
  prepareSetupPhase,
  prepareMovieSelectionPhase,
  prepareMovieEliminationPhase,
  prepareRevealPhase,
  prepareGameOverPhase,
} from './setup';
import { getCards, saveUsedCards } from './data';
import { handleSelectMovie, handleEliminateMovie, handleVoteForPoster } from './actions';

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
  options: VamosAoCinemaOptions
): VamosAoCinemaInitialState => {
  return utils.helpers.getDefaultInitialState({
    gameId,
    gameName: GAME_NAMES.VAMOS_AO_CINEMA,
    uid,
    language,
    playerCounts: PLAYER_COUNTS,
    initialPhase: VAMOS_AO_CINEMA_PHASES.LOBBY,
    totalRounds: TOTAL_ROUNDS,
    store: {
      gameOrder: [],
      deck: [],
      deckIndex: -1,
    },
    options,
  });
};

/**
 * Exposes min and max player count
 */
export const playerCounts = PLAYER_COUNTS;

export const getNextPhase = async (gameName: string, gameId: string, players: Players): Promise<boolean> => {
  // Gather docs and references
  const { sessionRef, state, store } = await utils.firebase.getStateAndStoreReferences(
    gameName,
    gameId,
    'prepare next phase'
  );

  // Determine if it's game over
  const isGameOver = determineOutcome(state);
  // Determine next phase
  const nextPhase = determineNextPhase(state?.phase, state?.round, isGameOver);

  // RULES -> SETUP
  if (nextPhase === VAMOS_AO_CINEMA_PHASES.SETUP) {
    // Enter setup phase before doing anything
    await utils.firebase.triggerSetupPhase(sessionRef);

    // Request data
    const additionalData = await getCards(store.language);
    const newPhase = await prepareSetupPhase(store, state, players, additionalData);
    await utils.firebase.saveGame(sessionRef, newPhase);
    return getNextPhase(gameName, gameId, players);
  }

  // SETUP -> MOVIE_SELECTION
  if (nextPhase === VAMOS_AO_CINEMA_PHASES.MOVIE_SELECTION) {
    const newPhase = await prepareMovieSelectionPhase(store, state, players);
    return utils.firebase.saveGame(sessionRef, newPhase);
  }

  // MOVIE_SELECTION/MOVIE_ELIMINATION/REVEAL -> MOVIE_ELIMINATION
  if (nextPhase === VAMOS_AO_CINEMA_PHASES.MOVIE_ELIMINATION) {
    const newPhase = await prepareMovieEliminationPhase(store, state, players);
    return utils.firebase.saveGame(sessionRef, newPhase);
  }

  // MOVIE_ELIMINATION -> REVEAL
  if (nextPhase === VAMOS_AO_CINEMA_PHASES.REVEAL) {
    const newPhase = await prepareRevealPhase(store, state, players);
    return utils.firebase.saveGame(sessionRef, newPhase);
  }

  // REVEAL -> GAME_OVER
  if (nextPhase === VAMOS_AO_CINEMA_PHASES.GAME_OVER) {
    const newPhase = await prepareGameOverPhase(gameId, store, state, players);
    await saveUsedCards(store.movieDeck, store.goodReviewsDeck, store.badReviewsDeck);
    return utils.firebase.saveGame(sessionRef, newPhase);
  }

  return true;
};

/**
 * Handles movie submissions
 * May trigger next phase
 */
export const submitAction = async (data: VamosAoCinemaSubmitAction) => {
  const { gameId, gameName, playerId, action } = data;

  utils.firebase.validateSubmitActionPayload(gameId, gameName, playerId, action);

  switch (action) {
    case VAMOS_AO_CINEMA_ACTIONS.SELECT_MOVIE:
      utils.firebase.validateSubmitActionProperties(data, ['movieId'], 'select movie');
      return handleSelectMovie(gameName, gameId, playerId, data.movieId);
    case VAMOS_AO_CINEMA_ACTIONS.ELIMINATE_MOVIE:
      utils.firebase.validateSubmitActionProperties(data, ['movieId'], 'submit movie elimination');
      return handleEliminateMovie(gameName, gameId, playerId, data.movieId);
    case VAMOS_AO_CINEMA_ACTIONS.VOTE_FOR_POSTER:
      utils.firebase.validateSubmitActionProperties(data, ['movieId', 'posterId'], 'submit poster');
      return handleVoteForPoster(gameName, gameId, playerId, data.movieId, data.posterId);

    default:
      utils.firebase.throwException(`Given action ${action} is not allowed`);
  }
};
