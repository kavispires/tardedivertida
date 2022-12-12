import { ReactNode, useState } from 'react';
// Utils
import { PHASES } from 'utils/phases';
import { NOOP } from 'utils/constants';
// Components
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { GameOver } from './GameOver';
import { TheEndIcon } from 'components/icons/TheEndIcon';
import { Translate } from 'components/language';

type GameOverWrapperProps = {
  /**
   * The game info
   */
  info: GameInfo;
  /**
   * The game state
   */
  state: GameState;
  /**
   * The additional content of the screen
   */
  children?: ReactNode;
  /**
   * Custom announcement icon (default: TheEndIcon)
   */
  announcementIcon?: ReactNode;
  /**
   * CUstom announcement title
   */
  announcementTitle?: ReactNode;
  /**
   * Custom announcement duration (default: 3)
   */
  announcementDuration?: number;
  /**
   * Custom announcement content
   */
  announcementContent?: ReactNode;
  /**
   * Customize rate widget text
   */
  rateWidgetCustomText?: ReactNode;
};

export function GameOverWrapper({
  info,
  state,
  announcementIcon = <TheEndIcon />,
  announcementTitle,
  announcementDuration = 3,
  announcementContent,
  children = <></>,
  rateWidgetCustomText,
}: GameOverWrapperProps) {
  const [step] = useState(0);

  const announcement = (
    <PhaseAnnouncement
      icon={announcementIcon}
      title={
        <Translate pt="E o jogo chegou ao fim..." en="And the game is over..." custom={announcementTitle} />
      }
      onClose={NOOP}
      currentRound={state?.round?.current}
      duration={announcementDuration}
      type="overlay"
    >
      {Boolean(announcementContent) && announcementContent}
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer
      info={info}
      phase={state?.phase}
      allowedPhase={PHASES.DEFAULT.GAME_OVER}
      className="game-over__container"
    >
      <StepSwitcher step={step}>
        {/*Step 0 */}
        <GameOver
          state={state}
          info={info}
          rateWidgetCustomText={rateWidgetCustomText}
          announcement={announcement}
        >
          {children}
        </GameOver>

        {/*Step 1 */}
        <></>
      </StepSwitcher>
    </PhaseContainer>
  );
}
