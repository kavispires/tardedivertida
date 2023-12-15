// Utils
import { PAGE_DURATION } from './utils/constants';
import { getAvatarColorById } from 'utils/helpers';
import { buildPlayerMapping } from './utils/helpers';
// Components
import { Step } from 'components/steps';
import { RuleInstruction, Title } from 'components/text';
import { Translate } from 'components/language';
import { Forest } from './components/Forest';
import { AvatarName } from 'components/avatars';
import { SlideShowControls } from 'components/slide-show/SlideShowControls';
import { PlayerMapResultsSummary } from './components/ResultsSummary';
import { PointsHighlight } from 'components/metrics/PointsHighlight';

type StepGalleryProps = {
  players: GamePlayers;
  forest: Tree[];
  activeIndex: number;
  setActiveIndex: GenericFunction;
  setStep: GenericFunction;
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
