// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
import { useUser } from 'hooks/useUser';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
// Icons
import { MovieTheaterIcon } from 'icons/MovieTheaterIcon';
import { ScaredIcon } from 'icons/ScaredIcon';
import { TomatoIcon } from 'icons/TomatoIcon';
// Components
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
// Internal
import { useOnSubmitMoviePosterAPIRequest } from './utils/api-requests';
import { getAnnouncementKey } from './utils/helpers';
import { VAMOS_AO_CINEMA_PHASES } from './utils/constants';
import { MovieHighlight } from './components/MovieHighlight';
import { StepReveal } from './StepReveal';

export function PhaseReveal({ players, state }: PhaseProps) {
  const user = useUser(players, state);
  const { step, setStep } = useStep();
  const [activePlayer] = useWhichPlayerIsThe('activePlayerId', state, players);

  const onSubmitPoster = useOnSubmitMoviePosterAPIRequest(setStep);

  const announcements = {
    mistake: (
      <PhaseAnnouncement
        icon={<TomatoIcon />}
        title={<Translate pt="Ah Não!" en="No this one!" />}
        currentRound={state?.round?.current}
        type="overlay"
        duration={3}
      ></PhaseAnnouncement>
    ),
    lose: (
      <PhaseAnnouncement
        icon={<ScaredIcon />}
        title={<Translate pt="Nãaaao!" en="Nooooo!" />}
        currentRound={state?.round?.current}
        type="overlay"
        duration={3}
      ></PhaseAnnouncement>
    ),
    win: (
      <PhaseAnnouncement
        icon={<MovieTheaterIcon />}
        title={
          <Translate pt="Até que enfim podemos assistir ao filme!" en="Finally! We can watch a movie!" />
        }
        currentRound={state?.round?.current}
        type="overlay"
        duration={7}
      >
        <Instruction>
          <Translate pt={<>E o filme é: </>} en={<>And the movie is: </>} />
          <br />
          <MovieHighlight movies={state.movies} movieId={state.finalMovieId} />
        </Instruction>
      </PhaseAnnouncement>
    ),
    normal: <></>,
  };

  return (
    <PhaseContainer phase={state?.phase} allowedPhase={VAMOS_AO_CINEMA_PHASES.REVEAL}>
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <StepReveal
          players={players}
          user={user}
          goodReview={state.goodReview}
          badReview={state.badReview}
          movies={state.movies}
          announcement={announcements[getAnnouncementKey(state.outcome, state.mistakes)]}
          onEliminateMovie={() => {}}
          activePlayer={activePlayer}
          eliminatedMovies={state.eliminatedMovies}
          votedForSelectedMovie={state.votedForSelectedMovie}
          turnOrder={state.turnOrder}
          mistakes={state.mistakes}
          round={state.round}
          outcome={state.outcome}
          currentMovieId={state.currentMovieId}
          finalMovieId={state.finalMovieId}
          score={state.score}
          onSubmitPoster={onSubmitPoster}
          posters={state.posters}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
