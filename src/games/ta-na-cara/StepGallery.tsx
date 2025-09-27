// Ant Design Resources
import { Flex } from 'antd';
// Types
import type { GamePlayer, GamePlayers } from 'types/player';
// Hooks
import type { SlideShowConfig } from 'hooks/useSlideShow';
import { useTemporarilyHidePlayersBar } from 'hooks/useTemporarilyHidePlayersBar';
// Utils
import { getAvatarColorById } from 'utils/helpers';
// Components
import { AvatarEntry } from 'components/avatars';
import { SuspectCard } from 'components/cards/SuspectCard';
import { Translate } from 'components/language';
import { SlideShow, SlideShowLabel } from 'components/slide-show';
import { Step, type StepProps } from 'components/steps';
import { RuleInstruction, StepTitle } from 'components/text';
// Internal
import type { PhaseAnsweringState, PhaseRevealState } from './utils/types';
import { usePersistentEliminator } from './utils/usePersistentEliminator';
import { CharactersBoard } from './components/CharactersBoard';
import { AllAnswersDrawer } from './components/AllAnswersDrawer';

type StepWaitOnAnswersProps = {
  players: GamePlayers;
  user: GamePlayer;
  slideShowConfig: SlideShowConfig;
} & Pick<PhaseRevealState, 'identitiesDict' | 'questionsDict' | 'gallery'>;

export function StepGallery({
  players,
  user,
  identitiesDict,
  questionsDict,
  gallery,
  slideShowConfig,
}: StepWaitOnAnswersProps) {
  useTemporarilyHidePlayersBar();

  const galleryEntry = gallery[slideShowConfig.slideIndex];
  const currentColor = getAvatarColorById(players[galleryEntry.playerId].avatarId);
  const activePlayer = players[galleryEntry.playerId];

  return (
    <Step fullWidth>
      <StepTitle wait>
        <Translate pt="Galeria" en="Gallery" />
      </StepTitle>

      <SlideShow
        config={slideShowConfig}
        barColor={currentColor}
        leftClassName="a-gallery__canvas"
        rightClassName="a-gallery__info"
      >
        <div>
          <div className="a-gallery__credits">
            <span className="uppercase">
              <AvatarEntry player={activePlayer} />
            </span>
          </div>
          <div>
            <Flex>
              <SuspectCard suspect={identitiesDict[galleryEntry.identityId]} width={120} />
            </Flex>
          </div>
        </div>

        <div>{galleryEntry.identityId}</div>
      </SlideShow>
    </Step>
  );
}
