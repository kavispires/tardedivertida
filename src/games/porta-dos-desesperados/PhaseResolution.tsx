// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
// Utils
import { PHASES } from 'utils/phases';
// Icons
import { MagicBookSpellIcon } from 'icons/MagicBookSpellIcon';
// Components
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
// Internal
import { StepResults } from './StepResults';

export function PhaseResolution({ players, state }: PhaseProps) {
  const { step, goToNextStep } = useStep();

  return (
    <PhaseContainer phase={state?.phase} allowedPhase={PHASES.PORTA_DOS_DESESPERADOS.RESOLUTION}>
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <PhaseAnnouncement
          icon={<MagicBookSpellIcon />}
          title={<Translate pt="Vocês escolheram a porta correta?" en="Have you opened the right door?" />}
          onClose={goToNextStep}
          currentRound={state?.round?.current}
          duration={3}
          type="block"
          unskippable
        />

        {/* Step 1 */}
        <StepResults
          doors={state.doors}
          pages={state.selectedPagesIds}
          currentCorridor={state.currentCorridor}
          trap={state.trap}
          players={players}
          round={state.round}
          outcome={state.outcome}
          answerDoorId={state.answerDoorId}
          magic={state.magic}
          usedMagic={state.usedMagic}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
