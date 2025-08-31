// Constants
import { MOVIES_PER_ROUND, OUTCOME, TOTAL_ROUNDS, VAMOS_AO_CINEMA_PHASES } from './constants';
import { GAME_NAMES } from '../../utils/constants';
// Types
import type { MovieReviewCard } from '../../types/tdr';
import type { FirebaseStateData, FirebaseStoreData, ResourceData } from './types';
// Utils
import utils from '../../utils';
// Internal
import {
  getAchievements,
  getFinalMovieId,
  getFinalMovies,
  getMoviePosterIds,
  getMovieTitle,
  getPhaseOutcome,
} from './helpers';
import { saveData } from './data';

/**
 * Setup
 * Build the card deck
 * Resets previous changes to the store
 * @returns
 */
export const prepareSetupPhase = async (
  store: FirebaseStoreData,
  _state: FirebaseStateData,
  players: Players,
  additionalData: ResourceData,
): Promise<SaveGamePayload> => {
  // Determine turn order
  const { gameOrder } = utils.players.buildGameOrder(players);

  // Add poster votes
  utils.players.addPropertiesToPlayers(players, { posters: {} });

  const movieDeck = utils.game.getRandomItems(
    Object.values(additionalData.movies),
    TOTAL_ROUNDS * MOVIES_PER_ROUND,
  );

  const [good, bad] = utils.game.shuffle(Object.values(additionalData.reviews)).reduce(
    (acc: [MovieReviewCard[], MovieReviewCard[]], card) => {
      acc[card.type === 'good' ? 0 : 1].push(card);

      return acc;
    },
    [[], []],
  );

  const goodReviewsDeck = utils.game.getRandomItems(good, TOTAL_ROUNDS);
  const badReviewsDeck = utils.game.getRandomItems(bad, TOTAL_ROUNDS);
  const moviePosters = utils.game
    .sliceIntoChunks(utils.game.shuffle(getMoviePosterIds()), 5)
    .splice(0, 5)
    .reduce((acc, posterList, index) => {
      acc[index] = posterList;
      return acc;
    }, {});

  const achievements = utils.achievements.setup(players, {
    group: 0,
    solo: 0,
    couple: 0,
    bad: 0,
    own: 0,
  });

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
        finalMovies: {},
        moviePosters,
        achievements,
      },
      state: {
        phase: VAMOS_AO_CINEMA_PHASES.SETUP,
        players,
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
  players: Players,
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
        players,
        round: utils.helpers.increaseRound(state.round),
        movies,
        goodReview,
        badReview,
        mistakes: [],
        eliminatedMovies: [],
        votedForSelectedMovie: [],
        score: 0,
      },
      stateCleanup: ['turnOrder'],
    },
  };
};

export const prepareMovieEliminationPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  // Get or build turnOrder
  const turnOrder =
    state.turnOrder ??
    utils.players.reorderGameOrder(
      store.gameOrder,
      utils.players.getActivePlayer(store.gameOrder, state.round.current),
    );

  const activePlayerId = utils.players.getNextPlayer(turnOrder, state.activePlayerId);

  utils.players.readyPlayers(players, activePlayerId);

  // Save
  return {
    update: {
      state: {
        phase: VAMOS_AO_CINEMA_PHASES.MOVIE_ELIMINATION,
        players,
        turnOrder,
        activePlayerId,
      },
    },
  };
};

export const prepareRevealPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  // Unready players
  utils.players.unReadyPlayers(players);
  const activePlayerId: PlayerId = state.activePlayerId;

  // Gather vote
  const { currentMovieId } = store;

  const votedForSelectedMovie = utils.players
    .getListOfPlayers(players)
    .filter((player) => player.movieId === currentMovieId)
    .map((player) => player.id);

  const wasMistake = votedForSelectedMovie.length > 0;
  const mistakes = state.mistakes ?? [];
  if (wasMistake) {
    utils.achievements.increase(store, activePlayerId, 'bad', 1);
    votedForSelectedMovie.forEach((playerId) => {
      utils.achievements.increase(store, playerId, 'own', 1);
    });
    mistakes.push(currentMovieId);
  }

  const eliminatedMovies = state.eliminatedMovies ?? [];
  eliminatedMovies.push(currentMovieId);

  const outcome = getPhaseOutcome(wasMistake, mistakes, eliminatedMovies);

  const finalMovieId = getFinalMovieId(eliminatedMovies);
  let score = state.score + (wasMistake ? 0 : 1);
  score += finalMovieId ? 1 : 0;

  const storeUpdate: PlainObject = {
    whatever: 1,
  };

  if (finalMovieId) {
    const id = `${state.round.current}-${finalMovieId}`;
    storeUpdate.finalMovies = {
      ...(store.finalMovies ?? {}),
      [id]: {
        id,
        title: getMovieTitle(state.movies, finalMovieId),
        posterId: '',
        session: state.round.current,
      },
    };
  }

  const posterUpdate: PlainObject = {
    posters: [],
  };

  if (finalMovieId) {
    posterUpdate.posters = store.moviePosters[state.round.current - 1];
  }

  if (outcome !== OUTCOME.CONTINUE) {
    const playersPerMovie: Record<string, PlayerId[]> = {};
    utils.players.getListOfPlayers(players).forEach((player) => {
      if (!playersPerMovie[player.movieId]) {
        playersPerMovie[player.movieId] = [];
      }
      playersPerMovie[player.movieId].push(player.id);
    });
    Object.values(playersPerMovie).forEach((playerIds) => {
      if (playerIds.length === 0) {
        utils.achievements.increase(store, playerIds[0], 'solo', 1);
      } else if (playerIds.length === 2) {
        utils.achievements.increase(store, playerIds[0], 'couple', 1);
        utils.achievements.increase(store, playerIds[1], 'couple', 1);
      } else {
        playerIds.forEach((playerId) => {
          utils.achievements.increase(store, playerId, 'group', 1);
        });
      }
    });
  }

  // Save
  return {
    update: {
      store: {
        ...storeUpdate,
        achievements: store.achievements,
      },
      state: {
        phase: VAMOS_AO_CINEMA_PHASES.REVEAL,
        players,
        currentMovieId,
        mistakes,
        outcome,
        eliminatedMovies,
        votedForSelectedMovie,
        finalMovieId: finalMovieId ?? utils.firestore.deleteValue(),
        score,
        groupScore: store.score,
        ...posterUpdate,
      },
    },
  };
};

export const prepareGameOverPhase = async (
  gameId: GameId,
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  await utils.firestore.markGameAsComplete(gameId);

  const finalMovies = getFinalMovies(store.finalMovies, players, store.moviePosters);

  const achievements = getAchievements(store);

  await utils.user.saveGameToUsers({
    gameName: GAME_NAMES.VAMOS_AO_CINEMA,
    gameId,
    startedAt: store.createdAt,
    players,
    winners: [],
    achievements,
    language: store.language,
  });

  await saveData(store.movieDeck, store.goodReviewsDeck, store.badReviewsDeck);

  utils.players.cleanup(players, []);

  return {
    update: {
      storeCleanup: utils.firestore.cleanupStore(store, []),
    },
    set: {
      state: {
        phase: VAMOS_AO_CINEMA_PHASES.GAME_OVER,
        players,
        round: state.round,
        gameEndedAt: Date.now(),
        groupScore: store.score + state.score,
        achievements,
        finalMovies,
      },
    },
  };
};
