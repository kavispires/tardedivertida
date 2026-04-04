// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useMock } from 'hooks/useMock';
import { useStep } from 'hooks/useStep';
// Icons
import { ReviewIcon } from 'icons/ReviewIcon';
// Components
import { Translate } from 'components/language/Translate';
import { PhaseAnnouncement } from 'components/phases/PhaseAnnouncement';
import { PhaseContainer } from 'components/phases/PhaseContainer';
import { RoundAnnouncement } from 'components/round/RoundAnnouncement';
import { StepSwitcher } from 'components/steps/StepSwitcher';
import { Instruction } from 'components/text/Instruction';
// Internal
import { useOnSubmitMovieSelectionAPIRequest } from './utils/api-requests';
import { mockMovieSelection } from './utils/mock';
import { VAMOS_AO_CINEMA_PHASES } from './utils/constants';
import type { PhaseMovieSelectionState } from './utils/types';
import { YourMovie } from './components/YourMovie';
import { StepSelectMovie } from './StepSelectMovie';

export function PhaseMovieSelection({ state, players, user }: PhaseProps<PhaseMovieSelectionState>) {
  const { step, setStep, goToNextStep } = useStep();

  const onSelectMovie = useOnSubmitMovieSelectionAPIRequest(setStep);

  useMock(() => {
    onSelectMovie({ movieId: mockMovieSelection() });
  });

  const announcement = (
    <PhaseAnnouncement
      icon={<ReviewIcon />}
      title={
        <Translate
          pt="Qual filme vamos ver?"
          en="What movie should we watch?"
        />
      }
      currentRound={state?.round?.current}
      type="overlay"
      duration={3}
    >
      <Instruction>
        <Translate
          pt={<>Selecione um filme que caiba a crítica boa e com a crítica ruim</>}
          en={<>You now will select a movie that fits both good and bad reviews</>}
        />
      </Instruction>
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer
      phase={state?.phase}
      allowedPhase={VAMOS_AO_CINEMA_PHASES.MOVIE_SELECTION}
    >
      <StepSwitcher
        step={step}
        players={players}
        waitingRoom={{
          content: (
            <YourMovie
              movies={state.movies}
              movieId={user.movieId}
            />
          ),
        }}
      >
        {/* Step 0 */}
        <RoundAnnouncement
          round={state.round}
          time={3}
          onPressButton={goToNextStep}
          buttonText=" "
        >
          <Instruction contained>
            {state.round.current}
            <Translate
              pt={<> de </>}
              en={<> of </>}
            />
            {state.round.total}
          </Instruction>
        </RoundAnnouncement>

        {/* Step 1 */}
        <StepSelectMovie
          players={players}
          user={user}
          goodReview={state.goodReview}
          badReview={state.badReview}
          movies={state.movies}
          announcement={announcement}
          onSelectMovie={onSelectMovie}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
