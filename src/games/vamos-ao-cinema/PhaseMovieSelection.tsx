// State & Hooks
import { useUser } from 'hooks/useUser';
import { useStep } from 'hooks/useStep';
import { useDelayedMock } from 'hooks/useMock';
import { useOnSubmitMovieSelectionAPIRequest } from './utils/api-requests';
// Resources & Utils
import { PHASES } from 'utils/phases';
import { mockMovieSelection } from './utils/mock';
// Icons
import { ReviewIcon } from 'icons/ReviewIcon';
// Components
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { Translate } from 'components/language';
import { YourMovie } from './components/YourMovie';
import { RoundAnnouncement } from 'components/round';
import { StepSelectMovie } from './StepSelectMovie';

export function PhaseMovieSelection({ players, state, info }: PhaseProps) {
  const user = useUser(players, state);
  const { step, setStep, goToNextStep } = useStep();

  const onSelectMovie = useOnSubmitMovieSelectionAPIRequest(setStep);

  useDelayedMock(() => {
    onSelectMovie({ movieId: mockMovieSelection() });
  });

  const announcement = (
    <PhaseAnnouncement
      icon={<ReviewIcon />}
      title={<Translate pt="Qual filme vamos ver?" en="What movie should we watch?" />}
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
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.VAMOS_AO_CINEMA.MOVIE_SELECTION}>
      <StepSwitcher
        step={step}
        conditions={[!user.isReady, !user.isReady, !user.isReady]}
        players={players}
        waitingRoomContent={<YourMovie movies={state.movies} movieId={user.movieId} />}
      >
        {/* Step 0 */}
        <RoundAnnouncement round={state.round} time={3} onPressButton={goToNextStep} buttonText=" ">
          <Instruction contained>
            {state.round.current}
            <Translate pt={<> de </>} en={<> of </>} />
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
