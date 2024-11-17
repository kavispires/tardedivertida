import { useState } from 'react';
// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
import { useUser } from 'hooks/useUser';
// Utils
import { PHASES } from 'utils/phases';
// Icons
import { DiscussionIcon } from 'icons/DiscussionIcon';
// Components
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
// Internal
import { useOnAddAnswerAPIRequest, useOnNextAnswersAPIRequest } from './utils/api-requests';
import { ComparingRules } from './components/RulesBlobs';
import { StepCompare } from './StepCompare';

export function PhaseCompare({ state, players }: PhaseProps) {
  const { step } = useStep(0);
  const user = useUser(players, state);
  const [allowedList, setAllowedList] = useState({});

  const onAddAnswer = useOnAddAnswerAPIRequest();
  const onNextAnswer = useOnNextAnswersAPIRequest(() => setAllowedList({}));

  const answerGroup = state.answersList[0];

  const announcement = (
    <PhaseAnnouncement
      icon={<DiscussionIcon />}
      title={<Translate pt="Respostas" en="Answers" />}
      currentRound={state?.round?.current}
      duration={state?.round?.current < 3 ? 20 : undefined}
      type="overlay"
    >
      <ComparingRules />
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer phase={state?.phase} allowedPhase={PHASES.MENTE_COLETIVA.COMPARE}>
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <StepCompare
          currentQuestion={state.currentQuestion}
          answerGroup={answerGroup}
          players={players}
          user={user}
          allAnswers={state.allAnswers}
          onAddAnswer={onAddAnswer}
          onNextAnswer={onNextAnswer}
          remainingGroupsCount={state.answersList?.length ?? 0}
          allowedList={allowedList}
          setAllowedList={setAllowedList}
          round={state.round}
          announcement={announcement}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
