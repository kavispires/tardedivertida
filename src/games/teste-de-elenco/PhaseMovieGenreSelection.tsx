// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
import { useUser } from 'hooks/useUser';
// Icons
import { MovieGenreIcon } from 'icons/MovieGenreIcon';
// Components
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
// Internal
import { useOnSubmitMovieGenreAPIRequest } from './utils/api-requests';
import { TESTE_DE_ELENCO_PHASES } from './utils/constants';
import { MovieGenreRules } from './components/RulesBlobs';
import { StepSelectGenre } from './StepSelectGenre';

export function PhaseMovieGenreSelection({ players, state }: PhaseProps) {
  const user = useUser(players, state);
  const { step, setStep } = useStep();

  const onSubmitGenre = useOnSubmitMovieGenreAPIRequest(setStep);

  const announcement = (
    <PhaseAnnouncement
      icon={<MovieGenreIcon />}
      title={<Translate pt="Seleção do Gênero do Filme" en="Movie Genre Selection" />}
      currentRound={state?.round?.current}
      type="overlay"
    >
      <Instruction>
        <MovieGenreRules />
      </Instruction>
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer phase={state?.phase} allowedPhase={TESTE_DE_ELENCO_PHASES.MOVIE_GENRE_SELECTION}>
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <StepSelectGenre
          user={user}
          onSubmitGenre={onSubmitGenre}
          genres={state.genres}
          moviesTitles={state.movieTitles}
          movieProps={state.movieProps}
          announcement={announcement}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
