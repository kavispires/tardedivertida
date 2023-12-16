// State & Hooks
import { useStep } from 'hooks/useStep';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Icons
import { MagicBookSpellIcon } from 'icons/MagicBookSpellIcon';
// Components
import { StepSwitcher } from 'components/steps';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepResults } from './StepResults';
import { Translate } from 'components/language';

function PhaseResolution({ players, state, info }: PhaseProps) {
  const { step, goToNextStep } = useStep();

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.PORTA_DOS_DESESPERADOS.RESOLUTION}>
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

export default PhaseResolution;
