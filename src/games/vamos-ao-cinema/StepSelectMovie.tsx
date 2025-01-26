// Types
import type { GamePlayers, GamePlayer } from 'types/player';
import type { MovieCard, MovieReviewCard } from 'types/tdr';
// Components
import { Translate } from 'components/language';
import { Step, type StepProps } from 'components/steps';
import { RuleInstruction, StepTitle } from 'components/text';
// Internal
import type { SubmitMovieSelectionPayload } from './utils/types';
import { Reviews } from './components/Reviews';
import { Movies } from './components/Movies';

type StepSelectMovieProps = {
  players: GamePlayers;
  user: GamePlayer;
  goodReview: MovieReviewCard;
  badReview: MovieReviewCard;
  movies: MovieCard[];
  onSelectMovie: (payload: SubmitMovieSelectionPayload) => void;
} & Pick<StepProps, 'announcement'>;

export function StepSelectMovie({
  user,
  announcement,
  goodReview,
  badReview,
  movies,
  onSelectMovie,
}: StepSelectMovieProps) {
  return (
    <Step fullWidth announcement={announcement}>
      <StepTitle>
        <Translate
          pt={<>Selecione um filme que caiba às duas críticas abaixo</>}
          en={<>Select a movie that fits both reviews</>}
        />
      </StepTitle>

      <Reviews goodReview={goodReview} badReview={badReview} />

      <RuleInstruction type="rule">
        <Translate
          pt={<>Temos uma crítica boa e uma crítica ruim, o filme que você escolher tem que caber a ambas.</>}
          en={<>There's a good and a bad review, the movie you pick must fit both.</>}
        />
      </RuleInstruction>

      <Movies movies={movies} user={user} onSelect={(movieId) => onSelectMovie({ movieId })} />
    </Step>
  );
}
