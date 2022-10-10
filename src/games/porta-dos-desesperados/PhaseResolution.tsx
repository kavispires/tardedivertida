// State & Hooks
import { useIsUserReady } from 'hooks/useIsUserReady';
import { useLanguage } from 'hooks/useLanguage';
import { useStep } from 'hooks/useStep';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Components
import { StepSwitcher } from 'components/steps';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepResults } from './StepResults';
import { MagicBookSpellIcon } from 'components/icons/MagicBookSpellIcon';

function PhaseResolution({ players, state, info }: PhaseProps) {
  const isUserReady = useIsUserReady(players, state);
  const { translate } = useLanguage();
  const { step, goToNextStep } = useStep();

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.PORTA_DOS_DESESPERADOS.RESOLUTION}>
      <StepSwitcher step={step} conditions={[!isUserReady, !isUserReady, !isUserReady]} players={players}>
        {/* Step 0 */}
        <PhaseAnnouncement
          icon={<MagicBookSpellIcon />}
          title={translate('Vocês escolheram a porta correta?', 'Have you opened the right door?')}
          onClose={goToNextStep}
          currentRound={state?.round?.current}
          duration={4}
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
