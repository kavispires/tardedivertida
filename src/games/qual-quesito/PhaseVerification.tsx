// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
// Icons
import { FeedbackIcon } from 'icons/collection';
// Components
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
// Internal
import type { PhaseVerificationState } from './utils/types';
import { QUAL_QUESITO_PHASES } from './utils/constants';
import { useOnSubmitEvaluationsAPIRequest } from './utils/api-requests';
import { StepEvaluateThings } from './StepEvaluateThings';

export function PhaseVerification({ players, state, user }: PhaseProps<PhaseVerificationState>) {
  const { step, setStep } = useStep();

  const onSubmitEvaluations = useOnSubmitEvaluationsAPIRequest(setStep);

  const announcement = (
    <PhaseAnnouncement
      icon={<FeedbackIcon />}
      title={
        <Translate
          pt="Avalie as coisas!"
          en="Evaluate the things!"
        />
      }
      currentRound={state?.round?.current}
      type="overlay"
    >
      <Instruction>
        <Translate
          pt="Cada coisa cabe ao quesito ou não? Avalie honestamente!"
          en="Does each thing fit the category or not? Evaluate honestly!"
        />
      </Instruction>
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer
      phase={state?.phase}
      allowedPhase={QUAL_QUESITO_PHASES.VERIFICATION}
    >
      <StepSwitcher
        step={step}
        players={players}
        conditions={[!!user.id && !!state.table]}
      >
        {/* Step 0 */}
        <StepEvaluateThings
          players={players}
          user={user}
          cardsDict={state.cardsDict}
          category={state.category}
          onSubmitEvaluations={onSubmitEvaluations}
          turnOrder={state.turnOrder}
          table={state.table}
          announcement={announcement}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
