import { Fragment } from 'react/jsx-runtime';
// Types
import type { GamePlayers } from 'types/game';
// Hooks
import { useCardWidth } from '@hooks/useCardWidth';
import type { SlideShowConfig } from '@hooks/useSlideShow';
// Utils
import { getAvatarColorById } from '@utils/helpers';
// Components
import { CanvasSVG } from '@components/canvas/CanvasSVG';
import { Translate } from '@components/language/Translate';
import { PopoverRule } from '@components/rules/PopoverRule';
import { SlideShow } from '@components/slide-show/SlideShow';
import { Step } from '@components/steps/Step';
import { StepTitle } from '@components/text/StepTitle';
// Internal
import type { ArteRuimCustomCard, ArteRuimGalleryWindow } from './utils/types';
import { GalleryWindowCredits } from './components/GalleryWindowCredits';
import { GalleryWindowGuesses } from './components/GalleryWindowGuesses';
import { GalleryWindowResult } from './components/GalleryWindowResult';
import { ScoringRules } from './components/TextBlobs';

type StepGalleryProps = {
  gallery: ArteRuimGalleryWindow[];
  players: GamePlayers;
  cards: ArteRuimCustomCard[];
  slideShowConfig: SlideShowConfig;
};

export function StepGallery({ gallery, players, cards, slideShowConfig }: StepGalleryProps) {
  const canvasWidth = useCardWidth(2, { gap: 16, minWidth: 200, maxWidth: 500 });

  const { drawing, artistId, id, text, playersPoints, playersSay } = gallery[slideShowConfig.slideIndex];

  const playerArtist = players[artistId];
  const currentColor = getAvatarColorById(playerArtist.avatarId);

  return (
    <Step
      fullWidth
      hidePlayersBar
    >
      <StepTitle size="small">
        <Translate
          pt="Galeria de Arte"
          en="Art Gallery"
        />
      </StepTitle>

      <PopoverRule content={<ScoringRules />} />

      <SlideShow
        config={slideShowConfig}
        barColor={currentColor}
        leftClassName="a-gallery__canvas"
        rightClassName="a-gallery__info"
      >
        <CanvasSVG
          drawing={drawing}
          width={canvasWidth}
          className="a-gallery__drawing"
        />

        <Fragment>
          <GalleryWindowCredits artist={playerArtist} />

          <GalleryWindowGuesses
            players={players}
            playersSay={playersSay}
            cards={cards}
            windowCardId={id}
            artistColor={currentColor}
          />

          <GalleryWindowResult
            playerArtist={playerArtist}
            correctAnswerId={id}
            correctAnswerText={text}
            playersPoints={playersPoints}
            playersSay={playersSay}
            players={players}
          />
        </Fragment>
      </SlideShow>
    </Step>
  );
}
