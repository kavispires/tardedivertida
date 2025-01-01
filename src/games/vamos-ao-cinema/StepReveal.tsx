// Types
import type { GameRound } from 'types/game';
import type { GamePlayers, GamePlayer } from 'types/player';
import type { MovieCard, MovieReviewCard } from 'types/tdr';
// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
import { useLoading } from 'hooks/useLoading';
// Utils
import { getAnimationClass, pluralize } from 'utils/helpers';
// Components
import { AvatarName } from 'components/avatars';
import { TransparentButton } from 'components/buttons';
import { HostNextPhaseButton } from 'components/host';
import { ImageCard } from 'components/image-cards';
import { Translate } from 'components/language';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { PointsHighlight } from 'components/metrics/PointsHighlight';
import { TurnOrder } from 'components/players';
import { ListOfPlayers } from 'components/players/ListOfPlayers';
import { Step, type StepProps } from 'components/steps';
import { Instruction, RuleInstruction, StepTitle, Title } from 'components/text';
import { ViewIf } from 'components/views';
// Internal
import { Reviews } from './components/Reviews';
import { Movies } from './components/Movies';
import { MistakeCountHighlight } from './components/MistakeCountHighlight';
import { MovieHighlight } from './components/MovieHighlight';

type StepRevealProps = {
  players: GamePlayers;
  user: GamePlayer;
  goodReview: MovieReviewCard;
  badReview: MovieReviewCard;
  movies: MovieCard[];
  onEliminateMovie: GenericFunction;
  activePlayer: GamePlayer;
  eliminatedMovies: string[];
  votedForSelectedMovie: PlayerId[];
  turnOrder: PlayerId[];
  mistakes: CardId[];
  round: GameRound;
  outcome: string;
  currentMovieId: string;
  finalMovieId?: string;
  score: number;
  onSubmitPoster: GenericFunction;
  posters: string[];
} & Pick<StepProps, 'announcement'>;

export function StepReveal({
  players,
  user,
  announcement,
  goodReview,
  badReview,
  movies,
  onEliminateMovie,
  activePlayer,
  eliminatedMovies,
  votedForSelectedMovie,
  turnOrder,
  mistakes,
  outcome,
  round,
  currentMovieId,
  finalMovieId,
  score,
  onSubmitPoster,
  posters,
}: StepRevealProps) {
  const posterWidth = useCardWidth(8, {
    gap: 16,
    minWidth: 80,
    maxWidth: 150,
    margin: 32,
  });
  const { isLoading } = useLoading();

  const isFinalMovie = Boolean(outcome === 'DONE' && mistakes.length < 2 && finalMovieId);

  return (
    <Step fullWidth announcement={announcement}>
      <StepTitle size="small" className={getAnimationClass('slideInDown')}>
        <Translate
          pt={
            <>
              <AvatarName player={activePlayer} addressUser /> eliminou
            </>
          }
          en={
            <>
              <AvatarName player={activePlayer} addressUser /> eliminated
            </>
          }
        />
        :
        <MovieHighlight movies={movies} movieId={currentMovieId} />
      </StepTitle>

      <Reviews goodReview={goodReview} badReview={badReview} />

      <RuleInstruction type="event">
        <ViewIf condition={outcome === 'CONTINUE'}>
          <Translate
            pt={<>Que bom, ninguém queria esse mesmo! </>}
            en={<>Good, nobody wanted this one! </>}
          />
        </ViewIf>

        <ViewIf condition={outcome === 'MISTAKE' || (outcome === 'DONE' && mistakes.length > 1)}>
          <Translate
            pt={
              <>
                Ah não! <ListOfPlayers players={players} list={votedForSelectedMovie} prefix="vote" />
                {pluralize(votedForSelectedMovie.length, 'escolheu', 'escolheram')} esse filme.
              </>
            }
            en={
              <>
                Oh no! <ListOfPlayers players={players} list={votedForSelectedMovie} prefix="vote" />
                chose this movie.
              </>
            }
          />
        </ViewIf>

        <ViewIf condition={isFinalMovie}>
          <Translate
            pt={
              <strong>
                Decidido! E ganhamos <PointsHighlight type="positive">{score}</PointsHighlight> pontos.
              </strong>
            }
            en={
              <strong>
                It's decided! And we scored <PointsHighlight type="positive">{score}</PointsHighlight> points.
              </strong>
            }
          />
        </ViewIf>

        <ViewIf condition={outcome !== 'DONE' && mistakes.length === 0}>
          <Translate
            pt={
              <>
                {' '}
                <br />
                Estamos indo bem.
              </>
            }
            en={
              <>
                {' '}
                <br />
                We're doing well.
              </>
            }
          />
        </ViewIf>

        <ViewIf condition={outcome !== 'DONE' && mistakes.length === 1}>
          <Translate
            pt={
              <>
                <br />
                Vocês já cometeram <MistakeCountHighlight>1 erro</MistakeCountHighlight>! Se um filme
                selecionado por outro jogador é eliminado, a rodada termina imediatamente.
              </>
            }
            en={
              <>
                <br />
                You already made <MistakeCountHighlight>1 mistake</MistakeCountHighlight>, if another movie
                selected by another player is eliminated, the round ends immediately.
              </>
            }
          />
        </ViewIf>

        <ViewIf condition={mistakes.length === 2}>
          <Translate
            pt={
              <strong>
                <br />
                Nãaaaaaaaooo.... não conseguimos decidir o filme, vamos voltar pra casa. A rodada acabou...
                Recebemos <PointsHighlight type="positive">{score}</PointsHighlight> pontos.
              </strong>
            }
            en={
              <strong>
                <br />
                Nooooooo.... we couldn't decide on a movie, let's just go home. The round is over.... We got{' '}
                <PointsHighlight type="positive">{score}</PointsHighlight> points.
              </strong>
            }
          />
        </ViewIf>
      </RuleInstruction>

      <ViewIf condition={isFinalMovie}>
        <div>
          <Title level={4} size="medium">
            {!!finalMovieId && <MovieHighlight movies={movies} movieId={finalMovieId} />}
          </Title>
          <Instruction contained>
            <Translate pt="Vote no poster do filme" en="Vote for the movie poster" />
            :
            <br />
            <SpaceContainer wrap>
              {posters.map((posterId) => (
                <TransparentButton
                  key={posterId}
                  disabled={isLoading || user.ready}
                  onClick={() =>
                    onSubmitPoster({
                      movieId: `${round.current}-${finalMovieId}`,
                      posterId,
                    })
                  }
                >
                  <ImageCard id={posterId} cardWidth={posterWidth} preview={false} />
                </TransparentButton>
              ))}
            </SpaceContainer>
          </Instruction>
        </div>
      </ViewIf>

      <Movies
        movies={movies}
        user={user}
        onSelect={(movieId) => onEliminateMovie({ movieId })}
        eliminatedMovies={eliminatedMovies}
        mistakes={mistakes}
        players={players}
        showResults={outcome === 'DONE'}
        disableButtons
      />

      <TurnOrder players={players} activePlayerId={activePlayer.id} order={turnOrder} />

      <HostNextPhaseButton round={round} autoTriggerTime={outcome !== 'DONE' ? 7 : undefined} />
    </Step>
  );
}
