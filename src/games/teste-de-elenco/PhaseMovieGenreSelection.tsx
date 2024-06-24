// Types
import { PhaseProps } from 'types/game';
// State & Hooks
import { useUser } from 'hooks/useUser';
import { useStep } from 'hooks/useStep';
import { useOnSubmitMovieGenreAPIRequest } from './utils/api-requests';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Icons
import { MovieGenreIcon } from 'icons/MovieGenreIcon';
// Components
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { Translate } from 'components/language';
import { StepSelectGenre } from './StepSelectGenre';

export function PhaseMovieGenreSelection({ players, state, info }: PhaseProps) {
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
        <Translate
          pt={
            <>
              Somos diretores de elenco tentando determinar o elenco para um filme! Haverá 5 papéis para
              escalar, mas primeiro precisamos decidir qual é o gênero do filme em que vamos trabalhar!
            </>
          }
          en={
            <>
              We are casting directors trying to determine the cast for a movie! There will be 5 roles to
              cast, but we first need to decide what genre is the movie we'll be working on!
            </>
          }
        />
      </Instruction>
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer
      info={info}
      phase={state?.phase}
      allowedPhase={PHASES.TESTE_DE_ELENCO.MOVIE_GENRE_SELECTION}
    >
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
