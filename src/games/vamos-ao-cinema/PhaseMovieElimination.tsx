// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useMock } from 'hooks/useMock';
import { useStep } from 'hooks/useStep';
import { useUser } from 'hooks/useUser';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
// Utils
import { PHASES } from 'utils/phases';
// Icons
import { PopcornIcon } from 'icons/PopcornIcon';
// Components
import { AvatarName } from 'components/avatars';
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
// Internal
import { useOnSubmitMovieEliminationAPIRequest } from './utils/api-requests';
import { mockMovieElimination } from './utils/mock';
import { MistakeCountHighlight } from './components/MistakeCountHighlight';
import { StepEliminateMovie } from './StepEliminateMovie';

export function PhaseMovieElimination({ players, state }: PhaseProps) {
  const user = useUser(players, state);
  const { step, setStep } = useStep();
  const [activePlayer, isActivePlayer] = useWhichPlayerIsThe('activePlayerId', state, players);

  const onEliminateMovie = useOnSubmitMovieEliminationAPIRequest(setStep);

  useMock(() => {
    if (isActivePlayer) {
      onEliminateMovie({ movieId: mockMovieElimination(user.movieId, state.eliminatedMovies) });
    }
  });

  const announcements = {
    first: (
      <PhaseAnnouncement
        icon={<PopcornIcon />}
        title={<Translate pt="Qual filme NÃO ver?" en="What NOT to watch?" />}
        currentRound={state?.round?.current}
        type="overlay"
        duration={state?.round?.current === 1 ? 12 : 7}
      >
        <Instruction>
          <Translate
            pt={
              <>
                De um em um, vamos eliminando filmes até o filme que todos escolheram seja o único que sobrou!
                <br />
                Se cometermos <MistakeCountHighlight>1 erro</MistakeCountHighlight>, tudo bem, mas se um
                segundo filme escolhido por outro jogador for eliminado, a rodada acaba.
                <br />
                <AvatarName player={activePlayer} addressUser /> começa escolhendo o primeiro filme.
              </>
            }
            en={
              <>
                One by one, we eliminate movies until only the movie that all of us have chosen is left!
                <br />
                If we make <MistakeCountHighlight>1 mistake</MistakeCountHighlight>, it's okay, but if a
                second movie chosen by another player is eliminated, the round is over.
                <br />
                <AvatarName player={activePlayer} addressUser /> begins by choosing the first movie.
              </>
            }
          />
        </Instruction>
      </PhaseAnnouncement>
    ),
    active: (
      <PhaseAnnouncement
        icon={<PopcornIcon />}
        title={<Translate pt="Sua vez!" en="Your turn!" />}
        currentRound={state?.round?.current}
        type="overlay"
        duration={3}
      >
        <Instruction>
          <Translate
            pt={<>Selecione um filme que você acha que ninguém escolheu.</>}
            en={<>Select a movie you think nobody has selected.</>}
          />
        </Instruction>
      </PhaseAnnouncement>
    ),
    normal: <></>,
  };

  return (
    <PhaseContainer phase={state?.phase} allowedPhase={PHASES.VAMOS_AO_CINEMA.MOVIE_ELIMINATION}>
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <StepEliminateMovie
          players={players}
          user={user}
          goodReview={state.goodReview}
          badReview={state.badReview}
          movies={state.movies}
          announcement={announcements[getAnnouncementKey(state.eliminatedMovies, isActivePlayer)]}
          onEliminateMovie={onEliminateMovie}
          activePlayer={activePlayer}
          isActivePlayer={isActivePlayer}
          eliminatedMovies={state.eliminatedMovies}
          turnOrder={state.turnOrder}
          mistakes={state.mistakes}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}

const getAnnouncementKey = (eliminatedMovies: CardId[], isActivePlayer: boolean) => {
  if (eliminatedMovies.length === 0) return 'first';
  if (isActivePlayer) return 'active';
  return 'normal';
};
