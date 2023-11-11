// State & Hooks
import { useUser } from 'hooks/useUser';
import { useStep } from 'hooks/useStep';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Icons
import { RobotIcon } from 'icons/RobotIcon';
// Components
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { Translate } from 'components/language';
import { StepResult } from './StepResults';
import { StepRanking } from 'games/adedanhx/StepRanking';

export function PhaseResults({ players, state, info }: PhaseProps) {
  const user = useUser(players, state);
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
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.NAO_SOU_ROBO.RESULTS}>
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
