// Hooks
import { useLanguage } from 'hooks/useLanguage';
import { useTemporarilyHidePlayersBar } from 'hooks/useTemporarilyHidePlayersBar';
// Utils
import { getAvatarColorById } from 'utils/helpers';
// Components
import { GalleryDreamDisplay } from './components/GalleryDreamDisplay';
import { GalleryGuesses } from './components/GalleryGuesses';
import { Step } from 'components/steps';
import { Title } from 'components/text';
import { SlideShow } from 'components/slide-show';

type StepResultsProps = {
  players: GamePlayers;
  gallery: SGalleryEntry[];
  activeIndex: number;
  setActiveIndex: GenericFunction;
  setStep: GenericFunction;
  isFirstGalleryRunThrough: boolean;
  correctGuessPoints: number;
};

export function StepResults({
  players,
  gallery,
  activeIndex,
  setActiveIndex,
  setStep,
  isFirstGalleryRunThrough,
  correctGuessPoints,
}: StepResultsProps) {
  useTemporarilyHidePlayersBar();
  const { translate } = useLanguage();

  const galleryEntry = gallery[activeIndex];
  const activePlayer = players[galleryEntry.playerId];

  return (
    <Step fullWidth className="s-results-step">
      <Title>{translate('Resultado', 'Results')}</Title>

      <SlideShow
        players={players}
        length={gallery.length}
        activeIndex={activeIndex}
        setActiveIndex={setActiveIndex}
        setStep={setStep}
        disableControls={isFirstGalleryRunThrough}
        barColor={getAvatarColorById(activePlayer.avatarId)}
        windowDuration={10}
      >
        <GalleryDreamDisplay entry={galleryEntry} activePlayer={activePlayer} />
        <GalleryGuesses entry={galleryEntry} players={players} correctGuessPoints={correctGuessPoints} />
      </SlideShow>
    </Step>
  );
}
