// State & Hooks
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
import { NOOP } from 'utils/constants';

function PhaseTemplate({ players, state, info }: PhaseProps) {
  const user = useUser(players, state);
  const { step, goToNextStep } = useStep();

  const announcement = (
    <PhaseAnnouncement
      icon={<TDIcon />}
      title={<Translate pt="?" en="?" />}
      onClose={NOOP}
      currentRound={state?.round?.current}
      type="overlay"
    >
      <Instruction>
        <Translate pt={<>?</>} en={<>?</>} />
      </Instruction>
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.TEMPLATE.UNKNOWN}>
      <StepSwitcher step={step} conditions={[!user.isReady, !user.isReady, !user.isReady]} players={players}>
        {/* Step 0 */}
        <div>Add Content Here {user.name}, pass 'announcement' to the step</div>

        {/* Step 1 */}
        <></>
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseTemplate;
