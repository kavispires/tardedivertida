// Types
import type { MovieCardData } from 'types/tdr';
// Icons
import { FilmReelIcon } from '@icons/FilmReelIcon';
// Components
import { Icon } from '@components/general/Icon';
import { Translate } from '@components/language/Translate';
import { Instruction } from '@components/text/Instruction';
import { TextHighlight } from '@components/text/TextHighlight';
// Internal
import { getMovieTitle } from '../utils/helpers';

type YourMovieProps = {
  movies: MovieCardData[];
  movieId?: string;
};
export function YourMovie({ movies, movieId }: YourMovieProps) {
  if (movieId) {
    return (
      <Instruction contained>
        <Translate
          pt="Seu Filme"
          en="Your Movie"
        />
        :
        <TextHighlight>
          <Icon icon={<FilmReelIcon />} /> {getMovieTitle(movies, movieId)}
        </TextHighlight>
      </Instruction>
    );
  }
  return null;
}
