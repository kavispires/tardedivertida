// Types
import { MovieCard } from 'types/tdr';

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

export const getAnnouncementKey = (outcome: string, mistakes: string[]) => {
  if (outcome === 'DONE' && mistakes.length === 2) return 'lose';
  if (outcome === 'MISTAKE') return 'mistake';
  if (outcome === 'DONE') return 'win';
  return 'normal';
};
