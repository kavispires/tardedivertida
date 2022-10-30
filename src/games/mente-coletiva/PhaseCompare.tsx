import { useState } from 'react';
// Hooks
import { useStep } from 'hooks/useStep';
import { useUser } from 'hooks/useUser';
import { useOnAddAnswerAPIRequest, useOnNextAnswersAPIRequest } from './utils/api-requests';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Components
import { StepSwitcher } from 'components/steps';
import { StepCompare } from './StepCompare';
import { ComparingRules } from './components/RulesBlobs';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { DiscussionIcon } from 'components/icons/DiscussionIcon';
import { Translate } from 'components/language';

function PhaseCompare({ state, players, info }: PhaseProps) {
  const { step, goToNextStep } = useStep(0);
  const user = useUser(players, state);
  const [allowedList, setAllowedList] = useState({});

  const onAddAnswer = useOnAddAnswerAPIRequest();
  const onNextAnswer = useOnNextAnswersAPIRequest(() => setAllowedList({}));

  const answerGroup = state.answersList[0];

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.MENTE_COLETIVA.COMPARE}>
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <PhaseAnnouncement
          icon={<DiscussionIcon />}
          title={<Translate pt="Respostas" en="Answers" />}
          onClose={goToNextStep}
          currentRound={state?.round?.current}
          duration={state?.round?.current < 3 ? 20 : undefined}
        >
          <ComparingRules />
        </PhaseAnnouncement>

        {/* Step 1 */}
        <StepCompare
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
