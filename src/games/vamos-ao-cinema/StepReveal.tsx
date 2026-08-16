// Types
import type { GameRound, GamePlayers, GamePlayer } from 'types/game';
import type { MovieCardData, MovieReviewCardData } from 'types/tdr';
// Hooks
import { useCardWidth } from '@hooks/useCardWidth';
import { useLoading } from '@hooks/useLoading';
// Utils
import { getAnimationClass, pluralize } from '@utils/helpers';
// Components
import { TransparentButton } from '@components/buttons/TransparentButton';
import { HostNextPhaseButton } from '@components/host/HostNextPhaseButton';
import { ImageCard } from '@components/image-cards/ImageCard';
import { Translate } from '@components/language/Translate';
import { SpaceContainer } from '@components/layout/SpaceContainer';
import { Surface } from '@components/layout/Surface';
import { PointsHighlight } from '@components/metrics/PointsHighlight';
import { PlayerAvatarName } from '@components/player/PlayerAvatarName';
import { ListOfPlayers } from '@components/players/ListOfPlayers';
import { PlayersTurnOrder } from '@components/players/PlayersTurnOrder';
import { Step, type StepProps } from '@components/steps/Step';
import { RuleInstruction } from '@components/text/RuleInstruction';
import { StepTitle } from '@components/text/StepTitle';
import { Title } from '@components/text/Title';
import { ViewIf } from '@components/views/ViewIf';
// Internal
import type { SubmitMovieEliminationPayload, SubmitMoviePosterPayload } from './utils/types';
import { Reviews } from './components/Reviews';
import { Movies } from './components/Movies';
import { MistakeCountHighlight } from './components/MistakeCountHighlight';
import { MovieHighlight } from './components/MovieHighlight';

type StepRevealProps = {
  players: GamePlayers;
  user: GamePlayer;
  goodReview: MovieReviewCardData;
  badReview: MovieReviewCardData;
  movies: MovieCardData[];
  onEliminateMovie: (payload: SubmitMovieEliminationPayload) => void;
  activePlayer: GamePlayer;
  eliminatedMovies: string[];
  votedForSelectedMovie: UID[];
  turnOrder: UID[];
  mistakes: UID[];
  round: GameRound;
  outcome: string;
  currentMovieId: string;
  finalMovieId?: string;
  score: number;
  onSubmitPoster: (payload: SubmitMoviePosterPayload) => void;
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
  const isEverybodyReady = Object.values(players).every((player) => player.ready);

  return (
    <Step
      fullWidth
      announcement={announcement}
    >
      <StepTitle
        size="small"
        className={getAnimationClass('slideInDown')}
      >
        <Translate
          en="{player} eliminated"
          pt="{player} eliminou"
          values={{
            player: (
              <PlayerAvatarName
                player={activePlayer}
                addressUser
              />
            ),
          }}
        />
        :
        <MovieHighlight
          movies={movies}
          movieId={currentMovieId}
        />
      </StepTitle>

      <Reviews
        goodReview={goodReview}
        badReview={badReview}
      />

      {!isEverybodyReady && (
        <HostNextPhaseButton
          round={round}
          autoTriggerTime={outcome !== 'DONE' ? 7 : undefined}
          withWaitingTimeBar={outcome !== 'DONE'}
        />
      )}

      <RuleInstruction type="event">
        <ViewIf condition={outcome === 'CONTINUE'}>
          <Translate
            pt="Que bom, ninguém queria esse mesmo!"
            en="Good, nobody wanted this one!"
          />
        </ViewIf>

        <ViewIf condition={outcome === 'MISTAKE' || (outcome === 'DONE' && mistakes.length > 1)}>
          <Translate
            en="Oh no! {playerList} chose this movie."
            pt={`Ah não! {playerList} ${pluralize(votedForSelectedMovie.length, 'escolheu', 'escolheram')} esse filme.`}
            values={{
              playerList: (
                <ListOfPlayers
                  players={players}
                  list={votedForSelectedMovie}
                  prefix="vote"
                />
              ),
            }}
          />
        </ViewIf>

        <ViewIf condition={isFinalMovie}>
          <strong>
            <Translate
              en="It's decided! And we scored {points}."
              pt="Decidido! E ganhamos {points}."
              values={{
                points: (
                  <PointsHighlight
                    type="positive"
                    value={score}
                  />
                ),
              }}
            />
          </strong>
        </ViewIf>

        <ViewIf condition={outcome !== 'DONE' && mistakes.length === 0}>
          <Translate
            en=" <br/> We're doing well."
            pt=" <br/> Estamos indo bem."
          />
        </ViewIf>

        <ViewIf condition={outcome !== 'DONE' && mistakes.length === 1}>
          <Translate
            en="<br/>You already made <mistake>1 mistake</mistake>, if another movie selected by another player is eliminated, the round ends immediately."
            pt="<br/>Vocês já cometeram <mistake>1 erro</mistake>! Se um filme selecionado por outro jogador é eliminado, a rodada termina imediatamente."
            values={{
              mistake: (text) => <MistakeCountHighlight>{text}</MistakeCountHighlight>,
            }}
          />
        </ViewIf>

        <ViewIf condition={mistakes.length === 2}>
          <strong>
            <Translate
              en="<br/> Nooooooo.... we couldn't decide on a movie, let's just go home. The round is over.... We got {points}."
              pt="<br/> Nãaaaaaaaooo.... não conseguimos decidir o filme, vamos voltar pra casa. A rodada acabou... Recebemos {points}."
              values={{
                points: (
                  <PointsHighlight
                    type="positive"
                    value={score}
                  />
                ),
              }}
            />
          </strong>
        </ViewIf>
      </RuleInstruction>

      <ViewIf condition={isFinalMovie}>
        <div>
          <Title
            level={4}
            size="medium"
          >
            {!!finalMovieId && (
              <MovieHighlight
                movies={movies}
                movieId={finalMovieId}
              />
            )}
          </Title>
          <Surface contained>
            <Translate
              pt="Vote no poster do filme"
              en="Vote for the movie poster"
            />
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
                  <ImageCard
                    cardId={posterId}
                    cardWidth={posterWidth}
                    preview={false}
                  />
                </TransparentButton>
              ))}
            </SpaceContainer>
          </Surface>
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

      <PlayersTurnOrder
        players={players}
        activePlayerId={activePlayer.id}
        order={turnOrder}
      />
    </Step>
  );
}
