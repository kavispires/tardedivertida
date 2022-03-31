// Ant Design Resources
import { Alert } from 'antd';
// Hooks
import { useLanguage } from 'hooks';
// Utils
import { LETTERS, SEPARATOR } from 'utils/constants';
// Components
import { AdminNextRoundButton, Gallery, Instruction, Step, Title, Translate } from 'components';
import { GalleryDreamDisplay } from './GalleryDreamDisplay';
import { getAvatarColorById } from 'utils/helpers';
import { GalleryGuesses } from './GalleryGuesses';

type StepResultsProps = {
  players: GamePlayers;
  gallery: SGalleryEntry[];
  activeIndex: number;
  setActiveIndex: GenericFunction;
  setStep: GenericFunction;
  isFirstGalleryRunThrough: boolean;
};

export function StepResults({
  players,
  gallery,
  activeIndex,
  setActiveIndex,
  setStep,
  isFirstGalleryRunThrough,
}: StepResultsProps) {
  const { translate } = useLanguage();

  const galleryEntry = gallery[activeIndex];
  const activePlayer = players[galleryEntry.playerId];

  return (
    <Step fullWidth className="s-results-step">
      <Title>{translate('Resultado', 'Results')}</Title>

      <Gallery
        players={players}
        galleryLength={gallery.length}
        activeIndex={activeIndex}
        setActiveIndex={setActiveIndex}
        setStep={setStep}
        disableControls={isFirstGalleryRunThrough}
        barColor={getAvatarColorById(activePlayer.avatarId)}
        windowDuration={10}
      >
        <GalleryDreamDisplay entry={galleryEntry} activePlayer={activePlayer} />
        <GalleryGuesses entry={galleryEntry} players={players} />
      </Gallery>
    </Step>
  );
}
