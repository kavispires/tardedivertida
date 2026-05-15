import type { MovieCard } from '../../types/tdr';
import { sampleSize } from 'lodash';
import {
  MAX_MISTAKES,
  MOVIE_POSTERS_COUNT,
  OUTCOME,
  TOTAL_MOVIE_OPTIONS,
  VAMOS_AO_CINEMA_ACHIEVEMENTS,
  VAMOS_AO_CINEMA_PHASES,
} from './constants';
import type { FirebaseStateData, FirebaseStoreData, VamosAoCinemaAchievement } from './types';
import { LETTERS } from '../../utils/constants';
import { makeArray } from '../../utils/helpers';
import utils from '../../utils';

/**
 * Determine the next phase based on the current one
 * @param currentPhase - The current phase of the game
 * @param round - The round object containing current round information
 * @param outcome - The outcome of the reveal phase
 */
export const determineNextPhase = (currentPhase: string, round: Round, outcome?: string): string => {
  const { SETUP, MOVIE_SELECTION, MOVIE_ELIMINATION, REVEAL, GAME_OVER } = VAMOS_AO_CINEMA_PHASES;
  const order = [SETUP, MOVIE_SELECTION, MOVIE_ELIMINATION, REVEAL, GAME_OVER];

  if (currentPhase === REVEAL) {
    if (outcome === OUTCOME.DONE) {
      if (round.forceLastRound || (round.current > 0 && round.current === round.total)) {
        return GAME_OVER;
      }
      return MOVIE_SELECTION;
    }
    return MOVIE_ELIMINATION;
  }

  return utils.game.nextPhaseDelegator(currentPhase, order);
};

/**
 * Determines the outcome based on the current game state
 * @param state - The current Firebase state data
 */
export const determineOutcome = (state: FirebaseStateData): string => {
  // During reveal
  if (state.phase === VAMOS_AO_CINEMA_PHASES.REVEAL) {
    // Double mistakes
    if (state.mistakes.length === MAX_MISTAKES) {
      return OUTCOME.DONE;
    }

    // Only one movie left
    if (state.eliminatedMovies.length === TOTAL_MOVIE_OPTIONS - 1) {
      return OUTCOME.DONE;
    }
  }

  return OUTCOME.CONTINUE;
};

/**
 * Gets the phase outcome based on mistakes and eliminated movies
 * @param wasMistake - Whether the last selection was a mistake
 * @param mistakes - The array of mistake IDs
 * @param eliminatedMovies - The array of eliminated movie IDs
 */
export const getPhaseOutcome = (wasMistake: boolean, mistakes: UID[], eliminatedMovies: UID[]) => {
  if (eliminatedMovies.length === TOTAL_MOVIE_OPTIONS - 1) {
    return OUTCOME.DONE;
  }

  if (wasMistake) {
    return mistakes.length === MAX_MISTAKES ? OUTCOME.DONE : OUTCOME.MISTAKE;
  }

  return OUTCOME.CONTINUE;
};

/**
 * Get the letter'd id of the final movie
 * @param eliminatedMovies
 * @returns
 */
export const getFinalMovieId = (eliminatedMovies: UID[]) => {
  if (eliminatedMovies.length !== TOTAL_MOVIE_OPTIONS - 1) {
    return undefined;
  }

  const moviesLeft = Array(TOTAL_MOVIE_OPTIONS)
    .fill(0)
    .map((e, i) => LETTERS[e + i])
    .filter((movieId) => !eliminatedMovies.includes(movieId));

  return moviesLeft.length === 1 ? moviesLeft[0] : undefined;
};

/**
 * Gets the movie title from movies array based on letter
 * @param movies - The array of movie cards
 * @param letter - The letter representing the movie
 */
export const getMovieTitle = (movies: MovieCard[], letter: string) => {
  return {
    A: `${movies[0].prefix} ${movies[1].suffix}`,
    B: `${movies[1].prefix} ${movies[2].suffix}`,
    C: `${movies[2].prefix} ${movies[3].suffix}`,
    D: `${movies[3].prefix} ${movies[4].suffix}`,
    E: `${movies[4].prefix} ${movies[5].suffix}`,
    F: `${movies[6].prefix} ${movies[7].suffix}`,
    G: `${movies[7].prefix} ${movies[8].suffix}`,
    H: `${movies[8].prefix} ${movies[9].suffix}`,
    I: `${movies[9].prefix} ${movies[10].suffix}`,
    J: `${movies[10].prefix} ${movies[11].suffix}`,
  }[letter];
};

type FinalMovie = {
  id: UID;
  title: string;
  posterId: UID;
  session: number;
};

const getMostFrequentElementFromList = (list: string[]) => {
  let mf = 1;
  let m = 0;
  let item = '';
  for (let i = 0; i < list.length; i++) {
    for (let j = i; j < list.length; j++) {
      if (list[i] === list[j]) m++;
      if (mf < m) {
        mf = m;
        item = list[i];
      }
    }
    m = 0;
  }
  return item;
};

/**
 * Builds the final movies list with voted poster IDs
 * @param movies - The dictionary of final movie objects
 * @param players - The collection of players in the game
 * @param posters - The dictionary of poster IDs per session
 */
export const getFinalMovies = (
  movies: Record<string, FinalMovie>,
  players: Players,
  posters: Record<number, UID[]>,
): FinalMovie[] => {
  const finalMovies: FinalMovie[] = [];

  Object.values(movies).forEach((movie) => {
    const votes: string[] = [];
    utils.players.getListOfPlayers(players).forEach((player) => {
      if (player.posters[movie.id]) {
        votes.push(player.posters[movie.id]);
      }
    });

    const posterId =
      votes.length > 0
        ? getMostFrequentElementFromList(votes) || sampleSize(votes, 1)[0]
        : sampleSize(posters[movie.session - 1], 1)[0];

    finalMovies.push({
      id: movie.id,
      title: movie.title,
      posterId,
      session: movie.session,
    });
  });

  return finalMovies;
};

/**
 * Gets the array of movie poster IDs
 */
export const getMoviePosterIds = () => {
  return makeArray(MOVIE_POSTERS_COUNT, 1).map((id) => `mv-${id}`);
};

/**
 * Calculates and returns player achievements based on game statistics
 * @param store - The Firebase store data containing achievement counters
 */
export const getAchievements = (store: FirebaseStoreData) => {
  const achievements: Achievement<VamosAoCinemaAchievement>[] = [];

  // Most Group movies
  const { most: mostGroupMovies } = utils.achievements.getMostAndLeastOf(store, 'group');

  if (mostGroupMovies) {
    achievements.push({
      playerId: mostGroupMovies.playerId,
      type: VAMOS_AO_CINEMA_ACHIEVEMENTS.MOST_GROUP_SELECTIONS,
      value: mostGroupMovies.value,
    });
  }

  // Most Solo movies
  const { most: mostSoloMovies } = utils.achievements.getMostAndLeastOf(store, 'solo');

  if (mostSoloMovies) {
    achievements.push({
      playerId: mostSoloMovies.playerId,
      type: VAMOS_AO_CINEMA_ACHIEVEMENTS.MOST_SOLO_SELECTIONS,
      value: mostSoloMovies.value,
    });
  }

  // Most Couple movies
  const { most: mostCoupleMovies } = utils.achievements.getMostAndLeastOf(store, 'couple');

  if (mostCoupleMovies) {
    achievements.push({
      playerId: mostCoupleMovies.playerId,
      type: VAMOS_AO_CINEMA_ACHIEVEMENTS.MOST_COUPLE_SELECTIONS,
      value: mostCoupleMovies.value,
    });
  }

  // Most bad eliminations
  const { most: mostBadEliminations } = utils.achievements.getMostAndLeastOf(store, 'bad');

  if (mostBadEliminations) {
    achievements.push({
      playerId: mostBadEliminations.playerId,
      type: VAMOS_AO_CINEMA_ACHIEVEMENTS.MOST_BAD_ELIMINATIONS,
      value: mostBadEliminations.value,
    });
  }

  // Most eliminated movie
  const { most: mostEliminatedMovie } = utils.achievements.getMostAndLeastOf(store, 'own');

  if (mostEliminatedMovie) {
    achievements.push({
      playerId: mostEliminatedMovie.playerId,
      type: VAMOS_AO_CINEMA_ACHIEVEMENTS.MOST_ELIMINATED_MOVIE,
      value: mostEliminatedMovie.value,
    });
  }

  return achievements;
};
