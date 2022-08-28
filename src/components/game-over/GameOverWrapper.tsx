import { ReactNode, useState } from 'react';
// Utils
import { useLanguage } from 'hooks/useLanguage';
import { PHASES } from 'utils/phases';
// Components
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { GameOver } from './GameOver';
import { TheEndIcon } from 'components/icons/TheEndIcon';

type GameOverWrapperProps = {
  info: GameInfo;
  state: GameState;
  children?: any;
  announcementIcon?: ReactNode;
  announcementTitle?: string;
  announcementDuration?: number;
  announcementContent?: any;
  showRateWidgetAfterContent?: boolean;
  rateWidgetCustomText?: any;
};

export function GameOverWrapper({
  info,
  state,
  announcementIcon = <TheEndIcon />,
  announcementTitle,
  announcementDuration = 3,
  announcementContent,
  children = <></>,
  showRateWidgetAfterContent = false,
  rateWidgetCustomText,
}: GameOverWrapperProps) {
  const [step, setStep] = useState(0);
  const { translate } = useLanguage();

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
          title={translate('E o jogo chegou ao fim...', 'And the game is over...', announcementTitle)}
          onClose={() => setStep(1)}
          currentRound={state?.round?.current}
          duration={announcementDuration}
        >
          {Boolean(announcementContent) && announcementContent}
        </PhaseAnnouncement>

        <GameOver
          state={state}
          showRateWidgetAfterContent={showRateWidgetAfterContent}
          rateWidgetCustomText={rateWidgetCustomText}
        >
          {children}
        </GameOver>
      </StepSwitcher>
    </PhaseContainer>
  );
}
