// Utils
import { getAnimationClass } from 'utils/helpers';
// Icons
import { StarIcon } from 'icons/StarIcon';
import { TomatoIcon } from 'icons/TomatoIcon';
// Components
import { Step } from 'components/steps';
import { Instruction, Title } from 'components/text';
import { Translate } from 'components/language';
import { Reviews } from './components/Reviews';
import { Movies } from './components/Movies';
import { TurnOrder } from 'components/players';
import { AvatarName, IconAvatar } from 'components/avatars';
import { MistakeCountHighlight } from './components/MistakeCountHighlight';

type StepEliminateMovieProps = {
  players: GamePlayers;
  user: GamePlayer;
  goodReview: MovieReviewCard;
  badReview: MovieReviewCard;
  movies: MovieCard[];
  onEliminateMovie: GenericFunction;
  activePlayer: GamePlayer;
  isActivePlayer: boolean;
  eliminatedMovies: string[];
  turnOrder: PlayerId[];
  mistakes: CardId[];
} & AnnouncementProps;

export function StepEliminateMovie({
  players,
  user,
  announcement,
  goodReview,
  badReview,
  movies,
  onEliminateMovie,
  activePlayer,
  isActivePlayer,
  eliminatedMovies,
  turnOrder,
  mistakes,
}: StepEliminateMovieProps) {
  return (
    <Step fullWidth announcement={announcement}>
      <Title className={getAnimationClass('tada')}>
        {isActivePlayer ? (
          <Translate
            pt={<>Elimine um filme que você acha que ninguém quer ver</>}
            en={<>Eliminate a movie that you think nobody wants to see</>}
          />
        ) : (
          <Translate
            pt={
              <>
                <AvatarName player={activePlayer} /> selecionará um filme que ninguém escolheu
              </>
            }
            en={
              <>
                <AvatarName player={activePlayer} /> will select a movie that nobody has chosen
              </>
            }
          />
        )}
      </Title>

      <Reviews goodReview={goodReview} badReview={badReview} />

      <Instruction contained>
        <Translate
          pt={
            <>
              O seu filme está marcado com uma <IconAvatar icon={<StarIcon />} />, os filmes eliminados estão
              marcados com <IconAvatar icon={<TomatoIcon />} />
            </>
          }
          en={
            <>
              Your movie is marked with a <IconAvatar icon={<StarIcon />} />, while eliminated movies are
              marked with <IconAvatar icon={<TomatoIcon />} />
            </>
          }
        />

        {mistakes.length === 1 && (
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
      </Instruction>

      <Movies
        movies={movies}
        user={user}
        onSelect={(movieId) => onEliminateMovie({ movieId })}
        eliminatedMovies={eliminatedMovies}
        mistakes={mistakes}
        players={players}
        disableButtons={!isActivePlayer}
      />

      <TurnOrder players={players} activePlayerId={activePlayer.id} order={turnOrder} />
    </Step>
  );
}
