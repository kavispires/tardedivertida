import { StepRanking } from 'games/adedanhx/StepRanking';
// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
// Icons
import { RobotIcon } from 'icons/RobotIcon';
// Components
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
// Internal
import { NAO_SOU_ROBO_PHASES } from './utils/constants';
import { StepResult } from './StepResults';

export function PhaseResults({ state, players, user }: PhaseProps) {
  const { step, goToNextStep, goToPreviousStep } = useStep();

  const announcement = (
    <PhaseAnnouncement
      icon={<RobotIcon />}
      title={<Translate pt="Beep Bop Beep" en="Beep Bop Beep" />}
      currentRound={state?.round?.current}
      type="overlay"
      duration={5}
    >
      <Instruction>
        <Translate
          pt={<>Hum... será que você realmente não é um robô?</>}
          en={<>Hm... are you sure you are not a robot?</>}
        />
      </Instruction>
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer phase={state?.phase} allowedPhase={NAO_SOU_ROBO_PHASES.RESULTS}>
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <StepResult
          user={user}
          players={players}
          announcement={announcement}
          result={state.result}
          goToNextStep={goToNextStep}
          robot={state.robot}
        />

        {/* Step 1 */}
        <StepRanking
          players={players}
          round={state.round}
          ranking={state.ranking}
          goToPreviousStep={goToPreviousStep}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
