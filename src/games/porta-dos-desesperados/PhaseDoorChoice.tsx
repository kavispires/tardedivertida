// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
// Icons
import { MagicDoorIcon } from 'icons/MagicDoorIcon';
// Components
import { ImageCardPreloadHand } from 'components/image-cards';
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer, PhaseTimerReset } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
import { ViewOr } from 'components/views';
// Internal
import { shouldAnnounceTrap } from './utils/helpers';
import { useOnMakeReady, useOnSubmitDoorAPIRequest } from './utils/api-requests';
import { PORTA_DOS_DESESPERADOS_PHASES } from './utils/constants';
import type { PhaseDoorChoiceState } from './utils/types';
import { TrapAnnouncement } from './components/TrapAnnouncement';
import { StepSelectDoor } from './StepSelectDoor';
import { StepWaitDoorSelection } from './StepWaitDoorSelection';

export function PhaseDoorChoice({ state, players, meta, user }: PhaseProps<PhaseDoorChoiceState>) {
  const { step, goToNextStep, setStep } = useStep();
  const [possessed, isPossessed] = useWhichPlayerIsThe('possessedId', state, players);

  const onSubmitDoor = useOnSubmitDoorAPIRequest();
  const onConfirmDoor = useOnMakeReady(setStep);

  return (
    <PhaseContainer phase={state?.phase} allowedPhase={PORTA_DOS_DESESPERADOS_PHASES.DOOR_CHOICE}>
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <PhaseAnnouncement
          icon={<MagicDoorIcon />}
          title={<Translate pt="Qual porta é a correta?" en="Which door is the correct one?" />}
          onClose={
            shouldAnnounceTrap(state.trap, PORTA_DOS_DESESPERADOS_PHASES.DOOR_CHOICE)
              ? goToNextStep
              : () => setStep(3)
          }
          currentRound={state?.round?.current}
          duration={3}
          unskippable
          type="block"
        >
          <Instruction>
            <Translate
              pt="Selecione a porta que os deixa mais próximos da saída"
              en="Select the door which could lead you closer to the exit"
            />
          </Instruction>
          <ImageCardPreloadHand hand={state?.doors ?? []} />
          <ImageCardPreloadHand hand={state?.selectedPagesIds ?? []} />
        </PhaseAnnouncement>

        {/* Step 1 */}
        <PhaseTimerReset goToNextStep={goToNextStep} />

        {/* Step 2 */}
        <TrapAnnouncement trapEntry={state.trapEntry} goToNextStep={goToNextStep} />

        {/* Step 3 */}
        <ViewOr condition={isPossessed}>
          <StepWaitDoorSelection
            doors={state.doors}
            pages={state.selectedPagesIds}
            currentCorridor={state.currentCorridor}
            trap={state.trap}
            trapEntry={state.trapEntry}
            players={players}
            magic={state.magic}
            answerDoorId={state.answerDoorId}
            botEnabled={Boolean(meta?.options?.withBots)}
          />

          <StepSelectDoor
            doors={state.doors}
            pages={state.selectedPagesIds}
            currentCorridor={state.currentCorridor}
            trap={state.trap}
            trapEntry={state.trapEntry}
            onSubmitDoor={onSubmitDoor}
            players={players}
            user={user}
            onConfirmDoor={onConfirmDoor}
            possessed={possessed}
            magic={state.magic}
            answerDoorId={state.answerDoorId}
            botEnabled={Boolean(meta?.options?.withBots)}
          />
        </ViewOr>
      </StepSwitcher>
    </PhaseContainer>
  );
}
