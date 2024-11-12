// Ant Design Resources
import { Space } from 'antd';
// Types
import type { GameRound } from 'types/game';
import type { GamePlayers } from 'types/player';
// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
import { SlideShowConfig } from 'hooks/useSlideShow';
import { useTemporarilyHidePlayersBar } from 'hooks/useTemporarilyHidePlayersBar';
// Utils
import { getAvatarColorById } from 'utils/helpers';
// Components
import { AvatarName } from 'components/avatars';
import { Translate } from 'components/language';
import { PopoverRule } from 'components/rules';
import { SlideShow } from 'components/slide-show';
import { Step } from 'components/steps';
import { Title } from 'components/text';
// Internal
import type { Characters, GalleryEntry } from './utils/types';
import { ScoringRules } from './components/RulesBlobs';
import { PlayerGlyphs } from './components/PlayerGlyphs';
import { GalleryGuesses } from './components/GalleryGuesses';
import { Card } from './components/Card';

type StepGalleryProps = {
  players: GamePlayers;
  characters: Characters;
  gallery: GalleryEntry[];
  slideShowConfig: SlideShowConfig;
  round: GameRound;
  imageCardMode: boolean;
};

export function StepGallery({
  players,
  gallery,
  characters,
  slideShowConfig,
  round,
  imageCardMode,
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
  const { playerId, characterId, playersPoints, playersSay } = gallery[slideShowConfig.slideIndex];

  const currentPlayer = players[playerId];
  const currentColor = getAvatarColorById(currentPlayer.avatarId);

  return (
    <Step className="l-step-album">
      <Title>
        <Translate pt="Galeria" en="Gallery" />
      </Title>

      <PopoverRule content={<ScoringRules currentRound={round.current} />} />

      <SlideShow
        config={slideShowConfig}
        barColor={currentColor}
        leftClassName="q-gallery__result"
        rightClassName="q-gallery__info"
      >
        <div className="q-gallery__result-container">
          <div className="q-gallery__player" style={{ backgroundColor: currentColor }}>
            <AvatarName player={currentPlayer} size="large" />
          </div>
          <Space className="space-container" direction="vertical">
            <Card character={characters[characterId]} width={characterWidth} imageCardMode={imageCardMode} />
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
          imageCardMode={imageCardMode}
        />
      </SlideShow>
    </Step>
  );
}
