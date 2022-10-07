// State & Hooks
import { useIsUserReady } from 'hooks/useIsUserReady';
import { useLanguage } from 'hooks/useLanguage';
import { useUser } from 'hooks/useUser';
import { useStep } from 'hooks/useStep';
import { useMock } from 'hooks/useMock';
// Resources & Utils
import { PHASES } from 'utils/phases';
import { shouldAnnounceTrap } from './utils/helpers';
import { mockDoorSelection } from './utils/mock';
// Components
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
import { PhaseAnnouncement, PhaseContainer, PhaseTimerReset } from 'components/phases';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
import { useOnMakeReady, useOnSubmitDoorAPIRequest } from './utils/api-requests';
import { TrapAnnouncement } from './components/TrapAnnouncement';
import { ViewOr } from 'components/views';
import { StepSelectDoor } from './StepSelectDoor';
import { StepWaitDoorSelection } from './StepWaitDoorSelection';
import { MagicDoorIcon } from 'components/icons/MagicDoorIcon';
import { useLoading } from 'hooks/useLoading';

function PhaseDoorChoice({ players, state, info }: PhaseProps) {
  const isUserReady = useIsUserReady(players, state);
  const { translate } = useLanguage();
  const user = useUser(players);
  const { step, goToNextStep, setStep } = useStep();
  const [possessed, isPossessed] = useWhichPlayerIsThe('possessedId', state, players);
  const { isLoading } = useLoading();

  const onSubmitDoor = useOnSubmitDoorAPIRequest(setStep);
  const onConfirmDoor = useOnMakeReady(setStep);

  // DEV Only
  useMock(() => {
    if (!user.ready && possessed.id && !isPossessed && !isLoading) {
      // Submit door
      if (!user.doorId) {
        debugger;
        onSubmitDoor({ doorId: mockDoorSelection(state.doors, state.answerDoorId) });
      }
      // Then make player ready
      if (user.doorId) {
        onConfirmDoor();
      }
    }
  }, [user.ready, possessed.id, isPossessed, isLoading, user.doorId]);

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.PORTA_DOS_DESESPERADOS.DOOR_CHOICE}>
      <StepSwitcher step={step} conditions={[!isUserReady, !isUserReady, !isUserReady]} players={players}>
        {/* Step 0 */}
        <PhaseAnnouncement
          icon={<MagicDoorIcon />}
          title={translate('Qual porta é a correta?', 'Which door is the correct one?')}
          onClose={
            shouldAnnounceTrap(state.trap, PHASES.PORTA_DOS_DESESPERADOS.DOOR_CHOICE)
              ? goToNextStep
              : () => setStep(3)
          }
          currentRound={state?.round?.current}
          duration={5}
          unskippable
        >
          <Instruction>Selecione a porta que os deixa mais próximos da saída</Instruction>
        </PhaseAnnouncement>

        {/* Step 1 */}
        <PhaseTimerReset goToNextStep={goToNextStep} />

        {/* Step 2 */}
        <TrapAnnouncement trap={state.trap} goToNextStep={goToNextStep} />

        {/* Step 3 */}
        <ViewOr orCondition={isPossessed}>
          <StepWaitDoorSelection
            doors={state.doors}
            pages={state.selectedPagesIds}
            currentCorridor={state.currentCorridor}
            trap={state.trap}
            players={players}
            magic={state.magic}
            answerDoorId={state.answerDoorId}
          />

          <StepSelectDoor
            doors={state.doors}
            pages={state.selectedPagesIds}
            currentCorridor={state.currentCorridor}
            trap={state.trap}
            onSubmitDoor={onSubmitDoor}
            players={players}
            user={user}
            onConfirmDoor={onConfirmDoor}
            possessed={possessed}
            magic={state.magic}
          />
        </ViewOr>
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseDoorChoice;
