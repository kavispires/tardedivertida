// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
import { useUser } from 'hooks/useUser';
// Utils
import { PHASES } from 'utils/phases';
// Icons
import { VerifyListIcon } from 'icons/VerifyListIcon';
// Components
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
// Internal
import { useOnNextEvaluationGroupAPIRequest, useOnRejectAnswersAPIRequest } from './utils/api-requests';
import { ScoringRule } from './components/RulesBlobs';
import { StepEvaluateGroup } from './StepEvaluateGroup';

export function PhaseEvaluation({ players, state, info }: PhaseProps) {
  const user = useUser(players, state);
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
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.ADEDANHX.EVALUATION}>
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
