// Types
import type { GamePlayers } from 'types/player';
import type { TextCard } from 'types/tdr';
// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
import type { SlideShowConfig } from 'hooks/useSlideShow';
import { useTemporarilyHidePlayersBar } from 'hooks/useTemporarilyHidePlayersBar';
// Utils
import { getAvatarColorById } from 'utils/helpers';
// Components
import { Translate } from 'components/language';
import { PopoverRule } from 'components/rules';
import { SlideShow } from 'components/slide-show';
import { Step } from 'components/steps';
import { StepTitle } from 'components/text';
// Internal
import type { GalleryEntry } from './utils/types';
import { GalleryWindowCredits } from './components/GalleryWindowCredits';
import { GalleryWindowGuesses } from './components/GalleryWindowGuesses';
import { GalleryWindowResult } from './components/GalleryWindowResult';
import { ScoringRules } from './components/RulesBlobs';
import { WarningDrawing } from './components/WarningDrawing';

type StepGalleryProps = {
  gallery: GalleryEntry[];
  players: GamePlayers;
  cards: Dictionary<TextCard>;
  slideShowConfig: SlideShowConfig;
  gameLanguage: Language;
};

export function StepGallery({ gallery, players, cards, slideShowConfig, gameLanguage }: StepGalleryProps) {
  useTemporarilyHidePlayersBar();

  const canvasWidth = useCardWidth(3, { gap: 16, minWidth: 150, maxWidth: 300 });

  const galleryEntry = gallery[slideShowConfig.slideIndex];

  const playerArtist = players[galleryEntry.artistId];
  const currentColor = getAvatarColorById(playerArtist.avatarId);

  return (
    <Step fullWidth>
      <StepTitle size="small">
        <Translate pt="Galeria de Placas" en="Signs Gallery" />
      </StepTitle>

      <PopoverRule content={<ScoringRules />} />

      <SlideShow
        config={slideShowConfig}
        barColor={currentColor}
        leftClassName="sda-gallery__canvas"
        rightClassName="sda-gallery__info"
      >
        <div>
          <WarningDrawing drawing={galleryEntry.drawing} width={canvasWidth} />
        </div>

        {/** biome-ignore lint/complexity/noUselessFragments: Represents the left page of the slide show */}
        <>
          <GalleryWindowCredits artist={playerArtist} />

          <GalleryWindowGuesses
            players={players}
            cards={cards}
            artistColor={currentColor}
            galleryEntry={galleryEntry}
            gameLanguage={gameLanguage}
          />

          <GalleryWindowResult cards={cards} galleryEntry={galleryEntry} gameLanguage={gameLanguage} />
        </>
      </SlideShow>
    </Step>
  );
}
