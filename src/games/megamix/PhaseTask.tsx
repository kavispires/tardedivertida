// State & Hooks
import { useUser } from 'hooks/useUser';
import { useStep } from 'hooks/useStep';
import { useOnSubmitTaskAPIRequest } from './utils/api-requests';
// Resources & Utils
import { PHASES } from 'utils/phases';
import { showDJPruPruPruStep } from './utils/helpers';
// Icons
import { DJIcon } from 'icons/DJIcon';
// Components
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { TaskIcon } from './components/TaskIcon';
import { TaskInstructions } from './components/TaskInstructions';
import { StepTask } from './StepTask';
import { TaskTitle } from './components/TaskTitle';
import { DJInstructions } from './components/RulesBlobs';
import { Translate } from 'components/language';
import { DJPruPruPruSound } from 'components/audio/DJPruPruPruSound';

function PhaseTask({ players, state, info }: PhaseProps) {
  const user = useUser(players, state);
  const { step, setStep, goToNextStep } = useStep(showDJPruPruPruStep(state.round));

  const onSubmitTask = useOnSubmitTaskAPIRequest(setStep);

  const announcement = (
    <PhaseAnnouncement
      icon={<TaskIcon task={state.task} />}
      title={<TaskTitle task={state.task} />}
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
        <PhaseAnnouncement
          icon={<DJIcon />}
          title={<DJAnnouncementTitle round={state.round} />}
          onClose={goToNextStep}
          currentRound={state?.round?.current}
          duration={state?.round?.current < 2 ? 20 : 7}
          unskippable
          type="block"
        >
          <DJPruPruPruSound />
          <DJInstructions round={state.round} />
        </PhaseAnnouncement>

        {/* Step 1 */}
        <StepTask
          task={state.task}
          round={state.round}
          players={players}
          announcement={announcement}
          onSubmitTask={onSubmitTask}
          user={user}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseTask;

function DJAnnouncementTitle({ round }: { round: GameRound }) {
  if (round.current < 2) return <Translate pt="A Balada" en="The Club" />;
  if (round.current === Math.round(round.total / 2))
    return <Translate pt="E tamo só esquentando" en="We're halfway!" />;
  return <Translate pt="Última música" en="The last song" />;
}
