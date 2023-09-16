// Ant Design Resources
import { Space } from 'antd';
// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
import { useTemporarilyHidePlayersBar } from 'hooks/useTemporarilyHidePlayersBar';
// Utils
import { PAGE_DURATION } from './utils/constants';
import { getAvatarColorById } from 'utils/helpers';
// Components
import { Translate } from 'components/language';
import { Step } from 'components/steps';
import { Title } from 'components/text';
import { PopoverRule } from 'components/rules';
import { SlideShow } from 'components/slide-show';
import { ScoringRules } from './components/RulesBlobs';
import { AvatarName } from 'components/avatars';
import { PlayerGlyphs } from './components/PlayerGlyphs';
import { CharacterCard } from 'components/cards/CharacterCard';
import { GalleryGuesses } from './components/GalleryGuesses';

type StepGalleryProps = {
  players: GamePlayers;
  characters: Characters;
  gallery: GalleryEntry[];
  activeIndex: number;
  setActiveIndex: GenericFunction;
  setStep: GenericFunction;
  isFirstGalleryRunThrough: boolean;
  round: GameRound;
};

export function StepGallery({
  players,
  gallery,
  characters,
  activeIndex,
  setActiveIndex,
  setStep,
  isFirstGalleryRunThrough,
  round,
}: StepGalleryProps) {
  useTemporarilyHidePlayersBar();
  const glyphWidth = useCardWidth(20, {
    gap: 16,
    minWidth: 45,
    maxWidth: 60,
  });
  const characterWidth = useCardWidth(8, {
    gap: 16,
    minWidth: 120,
    maxWidth: 200,
  });
  const { playerId, characterId, playersPoints, playersSay } = gallery[activeIndex];

  const currentPlayer = players[playerId];
  const currentColor = getAvatarColorById(currentPlayer.avatarId);

  return (
    <Step className="l-step-album">
      <Title>
        <Translate pt="Galeria" en="Gallery" />
      </Title>

      <PopoverRule content={<ScoringRules currentRound={round.current} />} />

      <SlideShow
        players={players}
        length={gallery.length}
        activeIndex={activeIndex}
        setActiveIndex={setActiveIndex}
        setStep={setStep}
        disableControls={isFirstGalleryRunThrough}
        barColor={currentColor}
        windowDuration={PAGE_DURATION}
        leftClassName="q-gallery__result"
        rightClassName="q-gallery__info"
      >
        <div className="q-gallery__result-container">
          <div className="q-gallery__player" style={{ backgroundColor: currentColor }}>
            <AvatarName player={currentPlayer} size="large" />
          </div>
          <Space className="space-container" direction="vertical">
            <CharacterCard character={characters[characterId]} size={characterWidth} />
            <PlayerGlyphs player={currentPlayer} glyphWidth={glyphWidth} />
          </Space>
        </div>

        <GalleryGuesses
          players={players}
          playersSay={playersSay}
          playersPoints={playersPoints}
          characters={characters}
          currentColor={currentColor}
          currentPlayer={currentPlayer}
          round={round}
        />
      </SlideShow>
    </Step>
  );
}
