// Types
import type { GameRound, GamePlayers } from 'types/game';
// Hooks
import { useCardWidth } from '@hooks/useCardWidth';
import type { SlideShowConfig } from '@hooks/useSlideShow';
// Utils
import { getAvatarColorById } from '@utils/helpers';
// Components
import { Translate } from '@components/language/Translate';
import { SpaceContainer } from '@components/layout/SpaceContainer';
import { PlayerAvatarName } from '@components/player/PlayerAvatarName';
import { PopoverRule } from '@components/rules/PopoverRule';
import { SlideShow } from '@components/slide-show/SlideShow';
import { Step } from '@components/steps/Step';
import { StepTitle } from '@components/text/StepTitle';
// Internal
import type { Characters, GalleryEntry } from './utils/types';
import { ScoringRules } from './components/RulesBlobs';
import { PlayerGlyphs } from './components/PlayerGlyphs';
import { GalleryGuesses } from './components/GalleryGuesses';
import { QSECard } from './components/QSECard';

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
    <Step
      className="l-step-album"
      hidePlayersBar
    >
      <StepTitle>
        <Translate
          pt="Galeria"
          en="Gallery"
        />
      </StepTitle>

      <PopoverRule content={<ScoringRules currentRound={round.current} />} />

      <SlideShow
        config={slideShowConfig}
        barColor={currentColor}
        leftClassName="q-gallery__result"
        rightClassName="q-gallery__info"
      >
        <div className="q-gallery__result-container">
          <div
            className="q-gallery__player"
            style={{ backgroundColor: currentColor }}
          >
            <PlayerAvatarName
              player={currentPlayer}
              size="large"
            />
          </div>
          <SpaceContainer vertical>
            <QSECard
              character={characters[characterId]}
              width={characterWidth}
              imageCardMode={imageCardMode}
            />
            <PlayerGlyphs
              player={currentPlayer}
              glyphWidth={glyphWidth}
            />
          </SpaceContainer>
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
