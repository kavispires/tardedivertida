// Types
import { MovieCard } from 'types/tdr';
// Utils
import { getMovieTitle } from '../utils/helpers';
// Icons
import { FilmReelIcon } from 'icons/FilmReelIcon';
// Components
import { IconAvatar } from 'components/avatars';
import { Translate } from 'components/language';
import { Instruction, TextHighlight } from 'components/text';

type YourMovieProps = {
  movies: MovieCard[];
  movieId?: string;
};
export function YourMovie({ movies, movieId }: YourMovieProps) {
  if (movieId) {
    return (
      <Instruction contained>
        <Translate pt="Seu Filme" en="Your Movie" />:
        <TextHighlight>
          <IconAvatar icon={<FilmReelIcon />} /> {getMovieTitle(movies, movieId)}
        </TextHighlight>
      </Instruction>
    );
  }
  return <></>;
}
