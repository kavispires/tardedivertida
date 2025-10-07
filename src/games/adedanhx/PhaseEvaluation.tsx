// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
// Icons
import { VerifyListIcon } from 'icons/VerifyListIcon';
// Components
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
// Internal
import { useOnNextEvaluationGroupAPIRequest, useOnRejectAnswersAPIRequest } from './utils/api-requests';
import { ADEDANHX_PHASES } from './utils/constants';
import { ScoringRule } from './components/RulesBlobs';
import { StepEvaluateGroup } from './StepEvaluateGroup';

export function PhaseEvaluation({ players, state, user }: PhaseProps) {
  const { step } = useStep();

  const onNextGroup = useOnNextEvaluationGroupAPIRequest();
  const onSubmitRejections = useOnRejectAnswersAPIRequest();

  const announcement = (
    <PhaseAnnouncement
      icon={<VerifyListIcon />}
      title={<Translate pt="Avaliação" en="Evaluation" />}
      currentRound={state?.round?.current}
      type="overlay"
      duration={10}
    >
      <Instruction>
        <Translate
          pt={
            <>
              Vamos conferir cada resposta!
              <br />
            </>
          }
          en={
            <>
              Let's check each answer!
              <br />
            </>
          }
        />
        <ScoringRule />
      </Instruction>
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer phase={state?.phase} allowedPhase={ADEDANHX_PHASES.EVALUATION}>
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <StepEvaluateGroup
          players={players}
          user={user}
          announcement={announcement}
          answersGroups={state.answersGroups}
          answersGroupIndex={state.answersGroupIndex}
          onNextGroup={onNextGroup}
          onSubmitRejections={onSubmitRejections}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
