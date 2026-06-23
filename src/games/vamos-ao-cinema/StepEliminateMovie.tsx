// Types
import type { GamePlayers, GamePlayer } from 'types/game';
import type { MovieCardData, MovieReviewCardData } from 'types/tdr';
// Utils
import { getAnimationClass } from '@utils/helpers';
// Icons
import { StarIcon } from '@icons/StarIcon';
import { TomatoIcon } from '@icons/TomatoIcon';
// Components
import { Icon } from '@components/general/Icon';
import { Translate } from '@components/language/Translate';
import { PlayerAvatarName } from '@components/player/PlayerAvatarName';
import { PlayersTurnOrder } from '@components/players/PlayersTurnOrder';
import { Step, type StepProps } from '@components/steps/Step';
import { RuleInstruction } from '@components/text/RuleInstruction';
import { StepTitle } from '@components/text/StepTitle';
// Internal
import type { SubmitMovieEliminationPayload } from './utils/types';
import { Reviews } from './components/Reviews';
import { Movies } from './components/Movies';
import { MistakeCountHighlight } from './components/MistakeCountHighlight';

type StepEliminateMovieProps = {
  players: GamePlayers;
  user: GamePlayer;
  goodReview: MovieReviewCardData;
  badReview: MovieReviewCardData;
  movies: MovieCardData[];
  onEliminateMovie: (payload: SubmitMovieEliminationPayload) => void;
  activePlayer: GamePlayer;
  isActivePlayer: boolean;
  eliminatedMovies: string[];
  turnOrder: UID[];
  mistakes: UID[];
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
              O seu filme está marcado com uma <Icon icon={<StarIcon />} />, os filmes eliminados estão
              marcados com <Icon icon={<TomatoIcon />} />
            </>
          }
          en={
            <>
              Your movie is marked with a <Icon icon={<StarIcon />} />, while eliminated movies are marked
              with <Icon icon={<TomatoIcon />} />
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

      <PlayersTurnOrder
        players={players}
        activePlayerId={activePlayer.id}
        order={turnOrder}
      />
    </Step>
  );
}
