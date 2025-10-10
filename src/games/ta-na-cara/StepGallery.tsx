// Ant Design Resources
// Types
import type { GamePlayer, GamePlayers } from 'types/player';
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
import type { PhaseRevealState } from './utils/types';
import { IdentityPage } from './components/IdentityPage';
import { GuessesPage } from './components/GuessesPage';

type StepWaitOnAnswersProps = {
  players: GamePlayers;
  user: GamePlayer;
  slideShowConfig: SlideShowConfig;
} & Pick<PhaseRevealState, 'identitiesDict' | 'questionsDict' | 'gallery'>;

export function StepGallery({
  players,
  identitiesDict,
  questionsDict,
  gallery,
  slideShowConfig,
}: StepWaitOnAnswersProps) {
  useTemporarilyHidePlayersBar();

  const galleryEntry = gallery[slideShowConfig.slideIndex];
  const currentColor = getAvatarColorById(players[galleryEntry.playerId].avatarId);
  const currentPlayer = players[galleryEntry.playerId];

  return (
    <Step fullWidth>
      <StepTitle wait>
        <Translate pt="Galeria" en="Gallery" />
      </StepTitle>

      <SlideShow
        config={slideShowConfig}
        barColor={currentColor}
        // leftClassName="a-gallery__canvas"
        // rightClassName="a-gallery__info"
      >
        <IdentityPage
          entry={galleryEntry}
          identitiesDict={identitiesDict}
          questionsDict={questionsDict}
          players={players}
          currentPlayer={currentPlayer}
          currentColor={currentColor}
        />

        <GuessesPage
          entry={galleryEntry}
          identitiesDict={identitiesDict}
          players={players}
          currentPlayer={currentPlayer}
          currentColor={currentColor}
        />
      </SlideShow>
    </Step>
  );
}
