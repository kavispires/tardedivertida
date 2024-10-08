// Types
import type { GamePlayers } from 'types/player';
// Hooks
import type { UseStep } from 'hooks/useStep';
import { useTemporarilyHidePlayersBar } from 'hooks/useTemporarilyHidePlayersBar';
// Utils
import { getAvatarColorById } from 'utils/helpers';
// Components
import { Translate } from 'components/language';
import { SlideShow } from 'components/slide-show';
import { Step } from 'components/steps';
import { Title } from 'components/text';
// Internal
import type { GalleryEntry } from './utils/types';
import { GalleryDreamDisplay } from './components/GalleryDreamDisplay';
import { GalleryGuesses } from './components/GalleryGuesses';

type StepResultsProps = {
  players: GamePlayers;
  gallery: GalleryEntry[];
  activeIndex: number;
  setActiveIndex: GenericFunction;
  setStep: UseStep['setStep'];
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

  const galleryEntry = gallery[activeIndex];
  const activePlayer = players[galleryEntry.playerId];

  return (
    <Step fullWidth className="s-results-step">
      <Title>
        <Translate pt="Resultado" en="Results" />
      </Title>

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
