// State & Hooks
import { useUser } from 'hooks/useUser';
import { useStep } from 'hooks/useStep';
import { useOnNextEvaluationGroupAPIRequest, useOnRejectAnswersAPIRequest } from './utils/api-requests';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Icons
import { VerifyListIcon } from 'icons/VerifyListIcon';
// Components
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { Translate } from 'components/language';

import { StepEvaluateGroup } from './StepEvaluateGroup';
import { ScoringRule } from './components/RulesBlobs';

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
          answerGroups={state.answerGroups}
          answerGroupIndex={state.answerGroupIndex}
          onNextGroup={onNextGroup}
          onSubmitRejections={onSubmitRejections}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
