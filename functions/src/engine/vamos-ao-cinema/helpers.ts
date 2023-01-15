import { MAX_MISTAKES, OUTCOME, TOTAL_MOVIE_OPTIONS, VAMOS_AO_CINEMA_PHASES } from './constants';
import { FirebaseStateData } from './types';
import { LETTERS } from '../../utils/constants';

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

export const getFinalMovie = (eliminatedMovies: CardId[]) => {
  if (eliminatedMovies.length !== TOTAL_MOVIE_OPTIONS - 1) {
    return undefined;
  }

  const moviesLeft = Array(TOTAL_MOVIE_OPTIONS)
    .fill(0)
    .map((e, i) => LETTERS[e + i])
    .filter((movieId) => !eliminatedMovies.includes(movieId));

  return moviesLeft.length === 1 ? moviesLeft[0] : undefined;
};
