// Utils
import { pluralize } from 'utils/helpers';
// Components
import { Step } from 'components/steps';
import { Instruction, Title } from 'components/text';
import { Translate } from 'components/language';
import { Reviews } from './components/Reviews';
import { Movies } from './components/Movies';
import { TurnOrder } from 'components/players';
import { AvatarName } from 'components/avatars';
import { AdminNextPhaseButton } from 'components/admin';
import { ListOfPlayers } from 'components/players/ListOfPlayers';
import { MistakeCountHighlight } from './components/MistakeCountHighlight';
import { MovieHighlight } from './components/MovieHighlight';
import { PointsHighlight } from 'components/metrics/PointsHighlight';

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
} & AnnouncementProps;

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
}: StepRevealProps) {
  return (
    <Step fullWidth announcement={announcement}>
      <Title size="small">
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
      </Title>

      <Reviews goodReview={goodReview} badReview={badReview} />

      <Instruction contained>
        {outcome === 'CONTINUE' && (
          <Translate
            pt={<>Que bom, ninguém queria esse mesmo! </>}
            en={<>Good, nobody wanted this one! </>}
          />
        )}

        {(outcome === 'MISTAKE' || (outcome === 'DONE' && mistakes.length === 2)) && (
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
        )}

        {outcome === 'DONE' && mistakes.length < 2 && finalMovieId && (
          <Translate
            pt={
              <strong>
                Decidido! Vamos assistir a <MovieHighlight movies={movies} movieId={finalMovieId} /> e
                ganhamos <PointsHighlight type="positive">{score}</PointsHighlight> pontos.
              </strong>
            }
            en={
              <strong>
                It's decided! Let's watch <MovieHighlight movies={movies} movieId={finalMovieId} /> e we
                scored <PointsHighlight type="positive">{score}</PointsHighlight> points.
              </strong>
            }
          />
        )}

        {mistakes.length === 0 && (
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
        )}

        {outcome !== 'DONE' && mistakes.length === 1 && (
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
        )}

        {mistakes.length === 2 && (
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
        )}
      </Instruction>

      <Movies
        movies={movies}
        user={user}
        onSelect={(movieId) => onEliminateMovie({ movieId })}
        eliminatedMovies={eliminatedMovies}
        mistakes={mistakes}
      />

      <TurnOrder players={players} activePlayerId={activePlayer.id} order={turnOrder} />

      <AdminNextPhaseButton round={round} autoTriggerTime={outcome !== 'DONE' ? 7 : undefined} />
    </Step>
  );
}
