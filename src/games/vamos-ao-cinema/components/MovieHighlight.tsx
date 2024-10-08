// Types
import type { MovieCard } from 'types/tdr';
// Icons
import { FilmReelIcon } from 'icons/FilmReelIcon';
// Components
import { IconAvatar } from 'components/avatars';
import { TextHighlight } from 'components/text';
// Internal
import { getMovieTitle } from '../utils/helpers';

type MovieHighlightProps = {
  movies: MovieCard[];
  movieId: CardId;
};

export function MovieHighlight({ movies, movieId }: MovieHighlightProps) {
  return (
    <TextHighlight>
      <IconAvatar icon={<FilmReelIcon />} /> {getMovieTitle(movies, movieId)}
    </TextHighlight>
  );
}
