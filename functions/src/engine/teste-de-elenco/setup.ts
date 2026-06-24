// Constants
import { GENRES, MAX_ROUNDS, TESTE_DE_ELENCO_PHASES, TOTAL_ACTORS, TOTAL_TRAITS } from './constants';
import { GAME_NAMES } from '../../utils/constants';
import { sampleSize, uniq } from 'lodash';
// Types
import type { FirebaseStateData, FirebaseStoreData, Movie, ResourceData } from './types';
// Utils
import utils from '../../utils';
import { buildMovie, determineCast, getNextRoleId } from './helpers';
import { setupAchievements, increaseAchievement, calculateAchievements } from './achievements';
import { cleanupStore, markGameAsComplete } from '../../services/game-session';

/**
 * Setup
 * Resets previous changes to the store
 * @returns
 */
export const prepareSetupPhase = async (
  _store: FirebaseStoreData,
  _state: FirebaseStateData,
  players: Players,
  additionalData: ResourceData,
): Promise<SaveGamePayload> => {
  // Get needed actors
  const actors = sampleSize(additionalData.allActors, TOTAL_ACTORS);

  // Get character traits
  const traits = sampleSize(additionalData.allCards, TOTAL_TRAITS).map((trait) => trait.answer);

  const achievements = setupAchievements(utils.players.getListOfPlayersIds(players));

  utils.players.addPropertiesToPlayers(players, { votes: [] });

  // Build movie title
  const movieTitles = additionalData.moviesSamples.reduce((acc: string[], movie, index) => {
    if (index % 2 === 0) {
      acc.push(`${movie.prefix} ${additionalData.moviesSamples[index + 1].suffix}`);
    }

    return acc;
  }, []);

  // Save
  return {
    update: {
      store: {
        actors,
        traits,
        achievements,
      },
      state: {
        phase: TESTE_DE_ELENCO_PHASES.SETUP,
        players,
        movieTitles,
        movieProps: additionalData.itemsSamples,
        round: {
          current: 0,
          total: MAX_ROUNDS,
        },
      },
    },
  };
};

/**
 * Prepare the movie genre selection phase
 * @param store
 * @param state
 * @param players
 * @returns
 *//**
 * [Movie Genre Selection Phase] - Director selects movie genre
 * @param store - The Firebase store data
 * @param state - The Firebase state data
 * @param players - The players object
 */ export const prepareMovieGenreSelectionPhase = async (
  _store: FirebaseStoreData,
  _state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  const genres = Object.values(GENRES).map((genre) => ({
    key: genre.id,
    title: genre.title,
  }));

  // Unready players
  utils.players.unReadyPlayers(players);

  // Save
  return {
    update: {
      state: {
        phase: TESTE_DE_ELENCO_PHASES.MOVIE_GENRE_SELECTION,
        players,
        genres,
      },
    },
  };
};

/**
 * Prepare the actor selection phase
 * @param store
 * @param state
 * @param players
 * @returns
 */
/**
 * [Actor Selection Phase] - Players select actors for the movie
 * @param store - The Firebase store data
 * @param state - The Firebase state data
 * @param players - The players object
 */
export const prepareActorSelectionPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  // Unready players
  utils.players.unReadyPlayers(players);

  let movie: Movie = state.movie;
  if (!movie) {
    movie = buildMovie(players, store, state.movieProps);
    utils.players.removePropertiesFromPlayers(players, ['genre', 'selectedProps', 'movieTitle']);
  }

  utils.players.removePropertiesFromPlayers(players, ['actorId']);

  // Determine active role
  // 1. If none, pick the first one
  // 2. If current, get the next one
  // 3. If last, restart picking the first one not cast
  const activeRoleId = getNextRoleId(movie, state.activeRoleId ?? -1);

  // Save
  return {
    update: {
      store: {
        traits: store.traits,
        actors: store.actors,
      },
      state: {
        phase: TESTE_DE_ELENCO_PHASES.ACTOR_SELECTION,
        round: utils.game.increaseRound(state.round),
        players,
        movie,
        activeRoleId,
      },
      stateCleanup: ['genres', 'ranking', 'outcome', 'movieTitles', 'movieProps'],
    },
  };
};

/**
 * [Result Phase] - Display selected actors and calculate scores
 * @param store - The Firebase store data
 * @param state - The Firebase state data
 * @param players - The players object
 */
export const prepareResultPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  const { outcome, ranking } = determineCast(players, state, store);

  utils.players.unReadyPlayers(players);

  // Save
  return {
    update: {
      store,
      state: {
        phase: TESTE_DE_ELENCO_PHASES.RESULT,
        players,
        movie: state.movie,
        outcome,
        ranking,
        round: {
          ...state.round,
          total: outcome === 'CAST' ? state.round.total - 1 : state.round.total,
        },
      },
    },
  };
};

/**
 * [Game Over Phase] - Finalize game and save results
 * @param gameId - The game session ID
 * @param store - The Firebase store data
 * @param state - The Firebase state data
 * @param players - The players object
 */
export const prepareGameOverPhase = async (
  gameId: UID,
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  const winners = utils.players.determineWinners(players);

  utils.players.getListOfPlayers(players).forEach((player) => {
    const unique = uniq(player.votes).length;
    increaseAchievement(store.achievements, player.id, 'actors', unique);
  });

  const achievements = calculateAchievements(store.achievements);

  await markGameAsComplete(gameId);

  await utils.user.saveGameToUsers({
    gameName: GAME_NAMES.TESTE_DE_ELENCO,
    gameId,
    startedAt: store.createdAt,
    players,
    winners,
    achievements,
    language: store.language,
  });

  return {
    update: {
      store: cleanupStore(store, []),
    },
    set: {
      state: {
        phase: TESTE_DE_ELENCO_PHASES.GAME_OVER,
        players,
        round: state.round,
        gameEndedAt: Date.now(),
        winners,
        movie: state.movie,
        achievements,
      },
    },
  };
};
