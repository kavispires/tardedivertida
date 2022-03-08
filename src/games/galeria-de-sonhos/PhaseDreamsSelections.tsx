// State & Hooks
import { useIsUserReady, useLanguage, useStep } from 'hooks';
import { useOnSubmitCardsAPIRequest } from './api-requests';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Components
import { PhaseAnnouncement, PhaseContainer, StepSwitcher } from 'components';
import { DreamSelectionRules } from './RulesBlobs';
import { StepDreamsSelection } from './StepDreamsSelection';

function PhaseDreamsSelections({ players, state, info }: PhaseProps) {
  const { translate } = useLanguage();
  const { step, goToNextStep, setStep } = useStep();
  const isUserReady = useIsUserReady(players, state);

  const onSubmitCards = useOnSubmitCardsAPIRequest(setStep);

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.GALERIA_DE_SONHOS.DREAMS_SELECTION}>
      <StepSwitcher step={step} conditions={[!isUserReady, !isUserReady, !isUserReady]} players={players}>
        {/* Step 0 */}
        <PhaseAnnouncement
          type="dream"
          title={translate('Visite sonhos!', 'Visit dreams!')}
          onClose={goToNextStep}
          currentRound={state?.round?.current}
        >
          <DreamSelectionRules />
        </PhaseAnnouncement>

        {/* Step 1 */}
        <StepDreamsSelection
          table={state.table}
          word={state.word}
          onSubmitCards={onSubmitCards}
          currentRound={state.round.current}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseDreamsSelections;
