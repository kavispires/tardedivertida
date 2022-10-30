// State & Hooks
import { useIsUserReady } from 'hooks/useIsUserReady';
import { useUser } from 'hooks/useUser';
import { useStep } from 'hooks/useStep';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Components
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { TDIcon } from 'components/icons/TDIcon';
import { Translate } from 'components/language';

function PhaseTemplate({ players, state, info }: PhaseProps) {
  const isUserReady = useIsUserReady(players, state);
  const user = useUser(players);
  const { step, goToNextStep } = useStep();

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.CINEGRAFISTAS_AMADORES.UNKNOWN}>
      <StepSwitcher step={step} conditions={[!isUserReady, !isUserReady, !isUserReady]} players={players}>
        {/* Step 0 */}
        <PhaseAnnouncement
          icon={<TDIcon />}
          title={<Translate pt="?" en="?" />}
          onClose={goToNextStep}
          currentRound={state?.round?.current}
        >
          <Instruction>Add text here</Instruction>
        </PhaseAnnouncement>

        {/* Step 1 */}
        <div>Add Content Here {user.name}</div>
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseTemplate;
