import { useState } from 'react';
// Utils
import { useLanguage } from 'hooks';
import { PHASES } from 'utils/phases';
// Components
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { GameOver } from './GameOver';

type GameOverWrapperProps = {
  info: GameInfo;
  state: GameState;
  children?: any;
  announcementIcon?:
    | 'criminal'
    | 'crown'
    | 'flag'
    | 'ladder'
    | 'medal'
    | 'newspaper'
    | 'nuclear-explosion'
    | 'poop'
    | 'spy'
    | 'the-end'
    | 'trophy';
  announcementTitle?: string;
  announcementDuration?: number;
  announcementContent?: any;
  showRateWidgetAfterContent?: boolean;
};

export function GameOverWrapper({
  info,
  state,
  announcementIcon = 'the-end',
  announcementTitle,
  announcementDuration = 3,
  announcementContent,
  children = <></>,
  showRateWidgetAfterContent = false,
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
          type={announcementIcon}
          title={translate('E o jogo chegou ao fim...', 'And the game is over...', announcementTitle)}
          onClose={() => setStep(1)}
          currentRound={state?.round?.current}
          duration={announcementDuration}
        >
          {Boolean(announcementContent) && announcementContent}
        </PhaseAnnouncement>

        <GameOver state={state} showRateWidgetAfterContent={showRateWidgetAfterContent}>
          {children}
        </GameOver>
      </StepSwitcher>
    </PhaseContainer>
  );
}