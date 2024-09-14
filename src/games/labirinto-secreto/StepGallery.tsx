// Types
import type { GamePlayer, GamePlayers } from 'types/player';
// Hooks
import type { UseStep } from 'hooks/useStep';
// Utils
import { getAvatarColorById } from 'utils/helpers';
// Components
import { AvatarName } from 'components/avatars';
import { Translate } from 'components/language';
import { PointsHighlight } from 'components/metrics/PointsHighlight';
import { SlideShowControls } from 'components/slide-show/SlideShowControls';
import { Step } from 'components/steps';
import { RuleInstruction, Title } from 'components/text';
// Internal
import type { Tree } from './utils/types';
import { PAGE_DURATION } from './utils/constants';
import { buildPlayerMapping } from './utils/helpers';
import { Forest } from './components/Forest';
import { PlayerMapResultsSummary } from './components/ResultsSummary';

type StepGalleryProps = {
  players: GamePlayers;
  forest: Tree[];
  activeIndex: number;
  setActiveIndex: GenericFunction;
  setStep: UseStep['setStep'];
  isFirstGalleryRunThrough: boolean;
  user: GamePlayer;
  gallery: GamePlayer[];
};

export function StepGallery({
  players,
  gallery,
  user,
  forest,
  activeIndex,
  setActiveIndex,
  setStep,
  isFirstGalleryRunThrough,
}: StepGalleryProps) {
  const playerCount = Object.keys(players).length;

  const currentPlayer = gallery[activeIndex];
  const currentColor = getAvatarColorById(currentPlayer.avatarId);
  const playerMapping = buildPlayerMapping(players, currentPlayer);

  return (
    <Step fullWidth>
      <Title>
        <Translate
          pt={
            <>
              Mapa do(a) <AvatarName player={currentPlayer} />
            </>
          }
          en={
            <>
              <AvatarName player={currentPlayer} />
              's map
            </>
          }
        />
      </Title>

      <RuleInstruction type="rule">
        <Translate
          pt={
            <>
              Você ganha pontos ao acertar o caminho do mapa. <br />
              Cada árvore correta vale <PointsHighlight>1 ponto</PointsHighlight> por jogador que acertar.{' '}
              <br />
              Se você for o único que acertou, você ganha{' '}
              <PointsHighlight>{playerCount} pontos</PointsHighlight>.
            </>
          }
          en={
            <>
              You get points by guessing the map path. <br />
              Each correct tree is worth <PointsHighlight>1 point</PointsHighlight> per player who guesses it.{' '}
              <br />
              If you are the only one who guessed it, you get{' '}
              <PointsHighlight>{playerCount} points</PointsHighlight>.
            </>
          }
        />
      </RuleInstruction>

      <PlayerMapResultsSummary players={players} forest={forest} currentPlayer={currentPlayer} user={user} />

      <div>
        <Forest
          forest={forest}
          map={currentPlayer.map}
          size="small"
          players={players}
          user={user}
          forestBorderColor={getAvatarColorById(currentPlayer.avatarId)}
          playerMapping={playerMapping}
        />

        <SlideShowControls
          length={gallery.length}
          activeIndex={activeIndex}
          setActiveIndex={setActiveIndex}
          setStep={setStep}
          disableControls={isFirstGalleryRunThrough}
          barColor={currentColor}
          windowDuration={PAGE_DURATION}
        />
      </div>
    </Step>
  );
}
