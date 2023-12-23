import {
  MAX_MISTAKES,
  MOVIE_POSTERS_COUNT,
  OUTCOME,
  TOTAL_MOVIE_OPTIONS,
  VAMOS_AO_CINEMA_PHASES,
} from './constants';
import { FirebaseStateData } from './types';
import { LETTERS } from '../../utils/constants';
import { makeArray } from '../../utils/game-utils';
import utils from '../../utils';

/**
 * Determine the next phase based on the current one
 * @param currentPhase
 * @param pointsToVictory
 * @returns
 */
export const determineNextPhase = (currentPhase: string, round: Round, outcome?: string): string => {
  const { RULES, SETUP, MOVIE_SELECTION, MOVIE_ELIMINATION, REVEAL, GAME_OVER } = VAMOS_AO_CINEMA_PHASES;
  const order = [RULES, SETUP, MOVIE_SELECTION, MOVIE_ELIMINATION, REVEAL, GAME_OVER];

  if (currentPhase === REVEAL) {
    if (outcome === OUTCOME.DONE) {
      if (round.forceLastRound || (round.current > 0 && round.current === round.total)) {
        return GAME_OVER;
      }
      return MOVIE_SELECTION;
    }
    return MOVIE_ELIMINATION;
  }

  const currentPhaseIndex = order.indexOf(currentPhase);

  if (currentPhaseIndex > -1) {
    return order[currentPhaseIndex + 1];
  }
  console.warn('Missing phase check');
  return MOVIE_ELIMINATION;
};

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

export const getPhaseOutcome = (wasMistake: boolean, mistakes: CardId[], eliminatedMovies: CardId[]) => {
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
export const getFinalMovieId = (eliminatedMovies: CardId[]) => {
  if (eliminatedMovies.length !== TOTAL_MOVIE_OPTIONS - 1) {
    return undefined;
  }

  const moviesLeft = Array(TOTAL_MOVIE_OPTIONS)
    .fill(0)
    .map((e, i) => LETTERS[e + i])
    .filter((movieId) => !eliminatedMovies.includes(movieId));

  return moviesLeft.length === 1 ? moviesLeft[0] : undefined;
};

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
  id: CardId;
  title: string;
  posterId: ImageCardId;
  session: number;
};

const getMostFrequentElementFromList = (list: string[]) => {
  let mf = 1;
  let m = 0;
  let item = '';
  for (let i = 0; i < list.length; i++) {
    for (let j = i; j < list.length; j++) {
      if (list[i] == list[j]) m++;
      if (mf < m) {
        mf = m;
        item = list[i];
      }
    }
    m = 0;
  }
  return item;
};

export const getFinalMovies = (
  movies: Record<string, FinalMovie>,
  players: Players,
  posters: Record<number, ImageCardId[]>
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
        ? getMostFrequentElementFromList(votes) || utils.game.getRandomItem(votes)
        : utils.game.getRandomItem(posters[movie.session - 1]);

    finalMovies.push({
      id: movie.id,
      title: movie.title,
      posterId,
      session: movie.session,
    });
  });

  return finalMovies;
};

export const getMoviePosterIds = () => {
  return makeArray(MOVIE_POSTERS_COUNT, 1).map((id) => `mv-${id}`);
};
