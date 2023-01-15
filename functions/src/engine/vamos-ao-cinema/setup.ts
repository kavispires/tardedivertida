// Constants
import { MOVIES_PER_ROUND, TOTAL_ROUNDS, VAMOS_AO_CINEMA_PHASES } from './constants';
// Types
import type { FirebaseStateData, FirebaseStoreData, ResourceData } from './types';
// Utils
import utils from '../../utils';
import { getFinalMovie, getPhaseOutcome } from './helpers';
// Internal

/**
 * Setup
 * Build the card deck
 * Resets previous changes to the store
 * @returns
 */
export const prepareSetupPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
  additionalData: ResourceData
): Promise<SaveGamePayload> => {
  // Determine turn order
  const { gameOrder } = utils.players.buildGameOrder(players);

  const movieDeck = utils.game.getRandomItems(
    Object.values(additionalData.movies),
    TOTAL_ROUNDS * MOVIES_PER_ROUND
  );

  const [good, bad] = utils.game.shuffle(Object.values(additionalData.reviews)).reduce(
    (acc: [MovieReviewCard[], MovieReviewCard[]], card) => {
      acc[card.type === 'good' ? 0 : 1].push(card);

      return acc;
    },
    [[], []]
  );

  const goodReviewsDeck = utils.game.getRandomItems(good, TOTAL_ROUNDS);
  const badReviewsDeck = utils.game.getRandomItems(bad, TOTAL_ROUNDS);

  // Save
  return {
    update: {
      store: {
        movieDeck,
        movieDeckIndex: 0,
        goodReviewsDeck,
        goodReviewsDeckIndex: 0,
        badReviewsDeck,
        badReviewsDeckIndex: 0,
        usedCards: [],
        selectedMovies: [],
        gameOrder,
        score: 0,
      },
      state: {
        phase: VAMOS_AO_CINEMA_PHASES.SETUP,
        round: {
          current: 0,
          total: TOTAL_ROUNDS,
        },
      },
    },
  };
};

export const prepareMovieSelectionPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  // Unready players
  utils.players.unReadyPlayers(players);
  utils.players.removePropertiesFromPlayers(players, ['movieId']);

  // Get cards
  const movies = Array(MOVIES_PER_ROUND)
    .fill(store.movieDeckIndex)
    .map((deckIndex, index) => store.movieDeck[deckIndex + index]);

  const goodReview = store.goodReviewsDeck[store.goodReviewsDeckIndex];
  const badReview = store.badReviewsDeck[store.badReviewsDeckIndex];

  // Save
  return {
    update: {
      store: {
        movieDeckIndex: store.movieDeckIndex + MOVIES_PER_ROUND,
        goodReviewsDeckIndex: store.goodReviewsDeckIndex + 1,
        badReviewsDeckIndex: store.badReviewsDeckIndex + 1,
        selectedMovies: [],
        score: store.score + (state.score ?? 0),
      },
      state: {
        phase: VAMOS_AO_CINEMA_PHASES.MOVIE_SELECTION,
        round: utils.helpers.increaseRound(state.round),
        movies,
        goodReview,
        badReview,
        mistakes: [],
        turnOrder: utils.firebase.deleteValue(),
        eliminatedMovies: [],
        votedForSelectedMovie: [],
        score: 0,
      },
      players,
    },
  };
};

export const prepareMovieEliminationPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  // Get or build turnOrder
  const turnOrder =
    state.turnOrder ??
    utils.players.reorderGameOrder(
      store.gameOrder,
      utils.players.getActivePlayer(store.gameOrder, state.round.current)
    );

  const activePlayerId = utils.players.getNextPlayer(turnOrder, state.activePlayerId);

  utils.players.readyPlayers(players, activePlayerId);

  // Save
  return {
    update: {
      state: {
        phase: VAMOS_AO_CINEMA_PHASES.MOVIE_ELIMINATION,
        turnOrder,
        activePlayerId,
      },
      players,
    },
  };
};

export const prepareRevealPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  // Gather vote
  const { currentMovieId } = store;

  const votedForSelectedMovie = utils.players
    .getListOfPlayers(players)
    .filter((player) => player.movieId === currentMovieId)
    .map((player) => player.id);

  const wasMistake = votedForSelectedMovie.length > 0;
  const mistakes = state.mistakes ?? [];
  if (wasMistake) {
    mistakes.push(currentMovieId);
  }

  const eliminatedMovies = state.eliminatedMovies ?? [];
  eliminatedMovies.push(currentMovieId);

  const outcome = getPhaseOutcome(wasMistake, mistakes, eliminatedMovies);

  const finalMovieId = getFinalMovie(eliminatedMovies);
  let score = state.score + (wasMistake ? 0 : 1);
  score += finalMovieId ? 1 : 0;

  // Save
  return {
    update: {
      state: {
        phase: VAMOS_AO_CINEMA_PHASES.REVEAL,
        currentMovieId,
        mistakes,
        outcome,
        eliminatedMovies,
        votedForSelectedMovie,
        finalMovieId: finalMovieId ?? utils.firebase.deleteValue(),
        score,
        groupScore: store.score,
      },
    },
  };
};

export const prepareGameOverPhase = async (
  gameId: GameId,
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  await utils.firebase.markGameAsComplete(gameId);

  return {
    set: {
      players,
      state: {
        phase: VAMOS_AO_CINEMA_PHASES.GAME_OVER,
        round: state.round,
        gameEndedAt: Date.now(),
        groupScore: store.score + state.score,
      },
    },
  };
};
