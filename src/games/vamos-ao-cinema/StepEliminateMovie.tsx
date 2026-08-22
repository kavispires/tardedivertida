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
            pt="Elimine um filme que você acha que ninguém quer ver"
            en="Eliminate a movie that you think nobody wants to see"
          />
        ) : (
          <Translate
            en="{player} will select a movie that nobody has chosen"
            pt="{player} selecionará um filme que ninguém escolheu"
            values={{
              player: <PlayerAvatarName player={activePlayer} />,
            }}
          />
        )}
      </StepTitle>

      <Reviews
        goodReview={goodReview}
        badReview={badReview}
      />

      <RuleInstruction type="rule">
        <Translate
          en="Your movie is marked with a <starIcon/>, while eliminated movies are marked with <tomatoIcon/>"
          pt="O seu filme está marcado com uma <starIcon/>, os filmes eliminados estão marcados com <tomatoIcon/>"
          values={{
            starIcon: <Icon icon={<StarIcon />} />,
            tomatoIcon: <Icon icon={<TomatoIcon />} />,
          }}
        />
        {mistakes.length === 1 && (
          <Translate
            en="
            <br/>
            You already made <mistake>1 mistake</mistake>, if another movie selected by another player is eliminated, the round ends immediately."
            pt="
            <br/>
            Vocês já cometeram <mistake>1 erro</mistake>! Se um filme selecionado por outro jogador é eliminado, a rodada termina imediatamente."
            values={{
              mistake: (text) => <MistakeCountHighlight>{text}</MistakeCountHighlight>,
            }}
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
