// Hooks
import { useCardWidth } from 'hooks';
// Utils
import { AVATARS } from 'utils/avatars';
import { WINDOW_DURATION } from './utils/constants';
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
  setStep: GenericFunction;
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
  const canvasWidth = useCardWidth(2, 16, 200, 500);

  const { drawing, artistId, id, text, playersPoints, playersSay } = gallery[activeIndex];

  const playerArtist = players[artistId];
  const currentColor = AVATARS[playerArtist.avatarId].color;

  return (
    <Step className="a-gallery-phase__windows">
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
        <CanvasSVG drawing={drawing} size={canvasWidth} className="a-gallery__drawing" />

        <>
          <GalleryWindowCredits artistName={playerArtist.name} artistAvatarId={playerArtist.avatarId} />

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
