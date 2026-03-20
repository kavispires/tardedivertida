// Utils
import { LETTERS } from 'utils/constants';
import { getRandomItem } from 'utils/helpers';

export const mockMovieSelection = () => {
  return getRandomItem(['A', 'A', 'A', 'A', 'A', 'A', 'A', 'B', 'F', 'G']);
};

export const mockMovieElimination = (ownMovieId: UID, eliminatedMovies: UID[]) => {
  const options = Array(10)
    .fill(0)
    .map((e, i) => LETTERS[e + i])
    .filter((movieId) => movieId !== ownMovieId && !eliminatedMovies.includes(movieId));

  return getRandomItem(options);
};
