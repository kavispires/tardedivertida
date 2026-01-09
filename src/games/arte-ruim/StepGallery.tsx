// Types
import type { GamePlayers } from 'types/player';
// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
import type { SlideShowConfig } from 'hooks/useSlideShow';
import { useTemporarilyHidePlayersBar } from 'hooks/useTemporarilyHidePlayersBar';
// Utils
import { getAvatarColorById } from 'utils/helpers';
// Components
import { CanvasSVG } from 'components/canvas';
import { Translate } from 'components/language';
import { PopoverRule } from 'components/rules';
import { SlideShow } from 'components/slide-show';
import { Step } from 'components/steps';
import { StepTitle } from 'components/text';
// Internal
import type { ArteRuimCard } from './utils/types';
import type { ArteRuimWindow } from './utils/types';
import { GalleryWindowCredits } from './components/GalleryWindowCredits';
import { GalleryWindowGuesses } from './components/GalleryWindowGuesses';
import { GalleryWindowResult } from './components/GalleryWindowResult';
import { ScoringRules } from './components/TextBlobs';

type StepGalleryProps = {
  gallery: ArteRuimWindow[];
  players: GamePlayers;
  cards: ArteRuimCard[];
  slideShowConfig: SlideShowConfig;
};

export function StepGallery({ gallery, players, cards, slideShowConfig }: StepGalleryProps) {
  useTemporarilyHidePlayersBar();

  const canvasWidth = useCardWidth(2, { gap: 16, minWidth: 200, maxWidth: 500 });

  const { drawing, artistId, id, text, playersPoints, playersSay } = gallery[slideShowConfig.slideIndex];

  const playerArtist = players[artistId];
  const currentColor = getAvatarColorById(playerArtist.avatarId);

  return (
    <Step fullWidth>
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

        {/** biome-ignore lint/complexity/noUselessFragments: I think it's needed */}
        <>
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
        </>
      </SlideShow>
    </Step>
  );
}
