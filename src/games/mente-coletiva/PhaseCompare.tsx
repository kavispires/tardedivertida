import { useState } from 'react';
// Hooks
import { useLanguage, useUser } from '../../hooks';
// Resources & Utils
import { PHASES } from '../../utils/phases';
// Components
import { PhaseAnnouncement, PhaseContainer, StepSwitcher, translate } from '../../components/shared';
import { CompareStep } from './CompareStep';
import { useOnAddAnswerAPIRequest, useOnNextAnswersAPIRequest } from './api-requests';
import { ComparingRules } from './RulesBlobs';

function PhaseCompare({ state, players, info }: PhaseProps) {
  const language = useLanguage();
  const [step, setStep] = useState(0);
  const user = useUser(players);
  const [allowedList, setAllowedList] = useState({});

  const onAddAnswer = useOnAddAnswerAPIRequest();
  const onNextAnswer = useOnNextAnswersAPIRequest(() => setAllowedList({}));

  const answerGroup = state.answersList[0];

  return (
    <PhaseContainer
      info={info}
      phase={state?.phase}
      allowedPhase={PHASES.MENTE_COLETIVA.COMPARE}
      className="u-word-selection-phase"
    >
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <PhaseAnnouncement
          type="discussion"
          title={translate('Respostas', 'Answers', language)}
          onClose={() => setStep(1)}
          currentRound={state?.round?.current}
          duration={state?.round?.current < 3 ? 20 : undefined}
        >
          <ComparingRules />
        </PhaseAnnouncement>

        {/* Step 1 */}
        <CompareStep
          currentQuestion={state.currentQuestion}
          answerGroup={answerGroup}
          players={players}
          user={user}
          allAnswers={state.allAnswers}
          onAddAnswer={onAddAnswer}
          onNextAnswer={onNextAnswer}
          remainingGroupsCount={state.answersList.length}
          allowedList={allowedList}
          setAllowedList={setAllowedList}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseCompare;