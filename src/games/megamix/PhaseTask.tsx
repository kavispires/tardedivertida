// State & Hooks
import { useUser } from 'hooks/useUser';
import { useStep } from 'hooks/useStep';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Components
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { Translate } from 'components/language';
import { NOOP } from 'utils/constants';
import { TaskIcon } from './components/TaskIcon';
import { TaskInstructions } from './components/TaskInstructions';
import { StepTask } from './StepTask';
import { TaskTitle } from './components/TaskTitle';
import { useOnSubmitTaskAPIRequest } from './utils/api-requests';

function PhaseTask({ players, state, info }: PhaseProps) {
  const user = useUser(players, state);
  const { step } = useStep();

  const onSubmitTask = useOnSubmitTaskAPIRequest();

  const announcement = (
    <PhaseAnnouncement
      icon={<TaskIcon task={state.task} />}
      title={<TaskTitle task={state.task} />}
      onClose={NOOP}
      currentRound={state?.round?.current}
      type="overlay"
    >
      <Instruction>
        <TaskInstructions task={state.task} />
      </Instruction>
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.MEGAMIX.TASK}>
      <StepSwitcher step={step} conditions={[!user.isReady]} players={players}>
        {/* Step 0 */}
        <StepTask
          task={state.task}
          players={players}
          announcement={announcement}
          onSubmitTask={onSubmitTask}
          user={user}
        />

        {/* Step 1 */}
        <></>
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseTask;
