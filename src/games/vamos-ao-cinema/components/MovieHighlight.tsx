// Utils
import { getMovieTitle } from '../utils/helpers';
// Components
import { FilmReelIcon } from 'components/icons/FilmReelIcon';
import { IconAvatar } from 'components/icons/IconAvatar';
import { TextHighlight } from 'components/text';

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
