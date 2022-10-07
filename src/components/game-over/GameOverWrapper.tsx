import { ReactNode, useState } from 'react';
// Utils
import { PHASES } from 'utils/phases';
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
  const [step, setStep] = useState(0);

  return (
    <PhaseContainer
      info={info}
      phase={state?.phase}
      allowedPhase={PHASES.DEFAULT.GAME_OVER}
      className="game-over__container"
    >
      <StepSwitcher step={step}>
        {/*Step 0 */}
        <PhaseAnnouncement
          icon={announcementIcon}
          title={
            <Translate
              pt="E o jogo chegou ao fim..."
              en="And the game is over..."
              custom={announcementTitle}
            />
          }
          onClose={() => setStep(1)}
          currentRound={state?.round?.current}
          duration={announcementDuration}
        >
          {Boolean(announcementContent) && announcementContent}
        </PhaseAnnouncement>

        <GameOver state={state} rateWidgetCustomText={rateWidgetCustomText}>
          {children}
        </GameOver>
      </StepSwitcher>
    </PhaseContainer>
  );
}
