// Types
import type { GamePlayers, GamePlayer } from 'types/player';
import type { MovieCard, MovieReviewCard } from 'types/tdr';
// Utils
import { getAnimationClass } from 'utils/helpers';
// Icons
import { StarIcon } from 'icons/StarIcon';
import { TomatoIcon } from 'icons/TomatoIcon';
// Components
import { PlayerAvatarName, IconAvatar } from 'components/avatars';
import { Translate } from 'components/language';
import { TurnOrder } from 'components/players';
import { Step, type StepProps } from 'components/steps';
import { RuleInstruction, StepTitle } from 'components/text';
// Internal
import type { SubmitMovieEliminationPayload } from './utils/types';
import { Reviews } from './components/Reviews';
import { Movies } from './components/Movies';
import { MistakeCountHighlight } from './components/MistakeCountHighlight';

type StepEliminateMovieProps = {
  players: GamePlayers;
  user: GamePlayer;
  goodReview: MovieReviewCard;
  badReview: MovieReviewCard;
  movies: MovieCard[];
  onEliminateMovie: (payload: SubmitMovieEliminationPayload) => void;
  activePlayer: GamePlayer;
  isActivePlayer: boolean;
  eliminatedMovies: string[];
  turnOrder: PlayerId[];
  mistakes: CardId[];
} & Pick<StepProps, 'announcement'>;

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
    <Step
      fullWidth
      announcement={announcement}
    >
      <StepTitle className={getAnimationClass('tada')}>
        {isActivePlayer ? (
          <Translate
            pt={<>Elimine um filme que você acha que ninguém quer ver</>}
            en={<>Eliminate a movie that you think nobody wants to see</>}
          />
        ) : (
          <Translate
            pt={
              <>
                <PlayerAvatarName player={activePlayer} /> selecionará um filme que ninguém escolheu
              </>
            }
            en={
              <>
                <PlayerAvatarName player={activePlayer} /> will select a movie that nobody has chosen
              </>
            }
          />
        )}
      </StepTitle>

      <Reviews
        goodReview={goodReview}
        badReview={badReview}
      />

      <RuleInstruction type="rule">
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
      </RuleInstruction>

      <Movies
        movies={movies}
        user={user}
        onSelect={(movieId) => onEliminateMovie({ movieId })}
        eliminatedMovies={eliminatedMovies}
        mistakes={mistakes}
        players={players}
        disableButtons={!isActivePlayer}
      />

      <TurnOrder
        players={players}
        activePlayerId={activePlayer.id}
        order={turnOrder}
      />
    </Step>
  );
}
