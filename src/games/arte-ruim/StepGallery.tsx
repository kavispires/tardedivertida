// Components

import { Translate } from 'components/language';
import { PopoverRule } from 'components/rules';
import { Step } from 'components/steps';
import { Title } from 'components/text';
import { GalleryWindow } from './components/GalleryWindow';
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
  return (
    <Step className="a-gallery-phase__windows">
      <Title>
        <Translate pt="Galeria de Arte" en="Art Gallery" />
      </Title>

      <PopoverRule content={<ScoringRules />} />

      {gallery && (
        <GalleryWindow
          window={gallery[activeIndex]}
          galleryLength={gallery.length}
          cards={cards}
          players={players}
          activeIndex={activeIndex}
          setActiveIndex={setActiveIndex}
          setStep={setStep}
          disableControls={isFirstGalleryRunThrough}
        />
      )}
    </Step>
  );
}
