// State & Hooks
import { useStep } from 'hooks/useStep';
import { useUser } from 'hooks/useUser';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Components
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { TDIcon } from 'components/icons/TDIcon';
import { Translate } from 'components/language';

function PhaseResolution({ players, state, info }: PhaseProps) {
  const user = useUser(players, state);
  const { step, goToNextStep } = useStep(0);

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.QUEM_NAO_MATA.RESOLUTION}>
      <StepSwitcher step={step} conditions={[!user.isReady, !user.isReady, !user.isReady]} players={players}>
        {/* Step 0 */}
        <PhaseAnnouncement
          icon={<TDIcon />}
          title={<Translate pt="Resultado" en="Resultado" />}
          onClose={goToNextStep}
          currentRound={state?.round?.current}
        >
          <Instruction>Add text here</Instruction>
        </PhaseAnnouncement>

        {/* Step 1 */}
        <div>Add Content Here</div>
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseResolution;
