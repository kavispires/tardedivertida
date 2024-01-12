// Types
import type { GamePlayers, GamePlayer } from 'types/player';
import type { MovieCard, MovieReviewCard } from 'types/tdr';
// Components
import { Step, type StepProps } from 'components/steps';
import { Instruction, Title } from 'components/text';
import { Translate } from 'components/language';
import { Reviews } from './components/Reviews';
import { Movies } from './components/Movies';

type StepSelectMovieProps = {
  players: GamePlayers;
  user: GamePlayer;
  goodReview: MovieReviewCard;
  badReview: MovieReviewCard;
  movies: MovieCard[];
  onSelectMovie: GenericFunction;
} & Pick<StepProps, 'announcement'>;

export function StepSelectMovie({
  players,
  user,
  announcement,
  goodReview,
  badReview,
  movies,
  onSelectMovie,
}: StepSelectMovieProps) {
  return (
    <Step fullWidth announcement={announcement}>
      <Title>
        <Translate
          pt={<>Selecione um filme que caiba às duas críticas abaixo</>}
          en={<>Select a movie that fits both reviews</>}
        />
      </Title>

      <Reviews goodReview={goodReview} badReview={badReview} />

      <Instruction contained>
        <Translate
          pt={<>Temos uma crítica boa e uma crítica ruim, o filme que você escolher tem que caber a ambas.</>}
          en={<>There's a good and a bad review, the movie you pick must fit both.</>}
        />
      </Instruction>

      <Movies movies={movies} user={user} onSelect={(movieId) => onSelectMovie({ movieId })} />
    </Step>
  );
}
