// Types
import type { GamePlayers } from 'types/player';
import type { ArteRuimCard } from './utils/types';
import type { ArteRuimWindow } from './utils/types';
// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
import { useTemporarilyHidePlayersBar } from 'hooks/useTemporarilyHidePlayersBar';
import type { UseStep } from 'hooks/useStep';
// Utils
import { WINDOW_DURATION } from './utils/constants';
import { getAvatarColorById } from 'utils/helpers';
// Components
import { CanvasSVG } from 'components/canvas';
import { Translate } from 'components/language';
import { PopoverRule } from 'components/rules';
import { SlideShow } from 'components/slide-show';
import { Step } from 'components/steps';
import { Title } from 'components/text';
import { GalleryWindowCredits } from './components/GalleryWindowCredits';
import { GalleryWindowGuesses } from './components/GalleryWindowGuesses';
import { GalleryWindowResult } from './components/GalleryWindowResult';
import { ScoringRules } from './components/TextBlobs';

type StepGalleryProps = {
  gallery: ArteRuimWindow[];
  players: GamePlayers;
  cards: ArteRuimCard[];
  activeIndex: number;
  setActiveIndex: GenericFunction;
  setStep: UseStep['setStep'];
  isFirstGalleryRunThrough: boolean;
};

export function StepGallery({
  gallery,
  players,
  cards,
  activeIndex,
  setActiveIndex,
  setStep,
  isFirstGalleryRunThrough,
}: StepGalleryProps) {
  useTemporarilyHidePlayersBar();

  const canvasWidth = useCardWidth(2, { gap: 16, minWidth: 200, maxWidth: 500 });

  const { drawing, artistId, id, text, playersPoints, playersSay } = gallery[activeIndex];

  const playerArtist = players[artistId];
  const currentColor = getAvatarColorById(playerArtist.avatarId);

  return (
    <Step fullWidth>
      <Title size="small">
        <Translate pt="Galeria de Arte" en="Art Gallery" />
      </Title>

      <PopoverRule content={<ScoringRules />} />

      <SlideShow
        players={players}
        length={gallery.length}
        activeIndex={activeIndex}
        setActiveIndex={setActiveIndex}
        setStep={setStep}
        disableControls={isFirstGalleryRunThrough}
        barColor={currentColor}
        windowDuration={WINDOW_DURATION}
        leftClassName="a-gallery__canvas"
        rightClassName="a-gallery__info"
      >
        <CanvasSVG drawing={drawing} width={canvasWidth} className="a-gallery__drawing" />

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
