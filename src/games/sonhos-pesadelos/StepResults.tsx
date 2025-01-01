// Types
import type { GamePlayers } from 'types/player';
// Hooks
import type { SlideShowConfig } from 'hooks/useSlideShow';
import { useTemporarilyHidePlayersBar } from 'hooks/useTemporarilyHidePlayersBar';
// Utils
import { getAvatarColorById } from 'utils/helpers';
// Components
import { Translate } from 'components/language';
import { SlideShow } from 'components/slide-show';
import { Step } from 'components/steps';
import { StepTitle } from 'components/text';
// Internal
import type { GalleryEntry } from './utils/types';
import { GalleryDreamDisplay } from './components/GalleryDreamDisplay';
import { GalleryGuesses } from './components/GalleryGuesses';

type StepResultsProps = {
  players: GamePlayers;
  gallery: GalleryEntry[];
  slideShowConfig: SlideShowConfig;
  correctGuessPoints: number;
};

export function StepResults({ players, gallery, slideShowConfig, correctGuessPoints }: StepResultsProps) {
  useTemporarilyHidePlayersBar();

  const galleryEntry = gallery[slideShowConfig.slideIndex];
  const activePlayer = players[galleryEntry.playerId];

  return (
    <Step fullWidth className="s-results-step">
      <StepTitle>
        <Translate pt="Resultado" en="Results" />
      </StepTitle>

      <SlideShow config={slideShowConfig} barColor={getAvatarColorById(activePlayer.avatarId)}>
        <GalleryDreamDisplay entry={galleryEntry} activePlayer={activePlayer} />
        <GalleryGuesses entry={galleryEntry} players={players} correctGuessPoints={correctGuessPoints} />
      </SlideShow>
    </Step>
  );
}
