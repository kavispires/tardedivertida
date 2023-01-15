// State & Hooks
import { useUser } from 'hooks/useUser';
import { useStep } from 'hooks/useStep';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
// Resources & Utils
import { PHASES } from 'utils/phases';
import { NOOP } from 'utils/constants';
// Components
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { Translate } from 'components/language';
import { TomatoIcon } from 'components/icons/TomatoIcon';
import { ScaredIcon } from 'components/icons/ScaredIcon';
import { MovieTheaterIcon } from 'components/icons/MovieTheaterIcon';
import { MovieHighlight } from './components/MovieHighlight';
import { StepReveal } from './StepReveal';

export function PhaseReveal({ players, state, info }: PhaseProps) {
  const user = useUser(players, state);
  const { step } = useStep();
  const [activePlayer] = useWhichPlayerIsThe('activePlayerId', state, players);

  const announcements = {
    mistake: (
      <PhaseAnnouncement
        icon={<TomatoIcon />}
        title={<Translate pt="Ah Não!" en="No this one!" />}
        onClose={NOOP}
        currentRound={state?.round?.current}
        type="overlay"
        duration={3}
      ></PhaseAnnouncement>
    ),
    lose: (
      <PhaseAnnouncement
        icon={<ScaredIcon />}
        title={<Translate pt="Nãaaao!" en="Nooooo!" />}
        onClose={NOOP}
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
        onClose={NOOP}
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
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.VAMOS_AO_CINEMA.REVEAL}>
      <StepSwitcher step={step} conditions={[!user.isReady, !user.isReady, !user.isReady]} players={players}>
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
        />

        {/* Step 1 */}
        <></>
      </StepSwitcher>
    </PhaseContainer>
  );
}

const getAnnouncementKey = (outcome: string, mistakes: string[]) => {
  if (outcome === 'DONE' && mistakes.length === 2) return 'lose';
  if (outcome === 'MISTAKE') return 'mistake';
  if (outcome === 'DONE') return 'win';
  return 'normal';
};
