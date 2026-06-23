// Types
import type { MovieCard } from 'types/tdr';
// Icons
import { FilmReelIcon } from '@icons/FilmReelIcon';
// Components
import { Icon } from '@components/general/Icon';
import { TextHighlight } from '@components/text/TextHighlight';
// Internal
import { getMovieTitle } from '../utils/helpers';

type MovieHighlightProps = {
  movies: MovieCard[];
  movieId: UID;
};

export function MovieHighlight({ movies, movieId }: MovieHighlightProps) {
  return (
    <TextHighlight>
      <Icon icon={<FilmReelIcon />} /> {getMovieTitle(movies, movieId)}
    </TextHighlight>
  );
}
