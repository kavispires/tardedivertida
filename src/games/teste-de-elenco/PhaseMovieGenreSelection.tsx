// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
// Icons
import { MovieGenreIcon } from 'icons/MovieGenreIcon';
// Components
import { Translate } from 'components/language/Translate';
import { PhaseAnnouncement } from 'components/phases/PhaseAnnouncement';
import { PhaseContainer } from 'components/phases/PhaseContainer';
import { StepSwitcher } from 'components/steps/StepSwitcher';
import { Instruction } from 'components/text/Instruction';
// Internal
import { useOnSubmitMovieGenreAPIRequest } from './utils/api-requests';
import { TESTE_DE_ELENCO_PHASES } from './utils/constants';
import { MovieGenreRules } from './components/RulesBlobs';
import { StepSelectGenre } from './StepSelectGenre';

export function PhaseMovieGenreSelection({ state, players, user }: PhaseProps) {
  const { step, setStep } = useStep();

  const onSubmitGenre = useOnSubmitMovieGenreAPIRequest(setStep);

  const announcement = (
    <PhaseAnnouncement
      icon={<MovieGenreIcon />}
      title={
        <Translate
          pt="Seleção do Gênero do Filme"
          en="Movie Genre Selection"
        />
      }
      currentRound={state?.round?.current}
      type="overlay"
    >
      <Instruction>
        <MovieGenreRules />
      </Instruction>
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer
      phase={state?.phase}
      allowedPhase={TESTE_DE_ELENCO_PHASES.MOVIE_GENRE_SELECTION}
    >
      <StepSwitcher
        step={step}
        players={players}
      >
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
