// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
// Icons
import { ChatIcon } from 'icons/ChatIcon';
// Components
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
// Internal
import { useOnSubmitAnswerAPIRequest } from './utils/api-requests';
import { TA_NA_CARA_PHASES } from './utils/constants';
import type { PhaseAnsweringState } from './utils/types';
import { StepAnswerTheQuestion } from './StepAnswerTheQuestion';
import { StepWaitOnAnswers } from './StepWaitOnAnswers';

export function PhaseAnswering({ state, players, user, meta }: PhaseProps<PhaseAnsweringState>) {
  const { step, setStep } = useStep();

  const onSubmitAnswer = useOnSubmitAnswerAPIRequest(setStep);

  const announcement = (
    <PhaseAnnouncement
      icon={<ChatIcon />}
      title={<Translate pt="Responda!" en="Answer the question!" />}
      currentRound={state?.round?.current}
      type="overlay"
      duration={4}
    />
  );

  return (
    <PhaseContainer phase={state?.phase} allowedPhase={TA_NA_CARA_PHASES.ANSWERING}>
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <StepAnswerTheQuestion
          announcement={announcement}
          players={players}
          user={user}
          grid={state.grid}
          identitiesDict={state.identitiesDict}
          currentQuestionId={state.currentQuestionId}
          questionsDict={state.questionsDict}
          vibesMode={state.vibesMode}
          questionCount={state.questionCount}
          onSubmitAnswer={onSubmitAnswer}
        />

        <StepWaitOnAnswers
          gameId={meta.gameId}
          players={players}
          user={user}
          grid={state.grid}
          identitiesDict={state.identitiesDict}
          currentQuestionId={state.currentQuestionId}
          questionsDict={state.questionsDict}
          questionCount={state.questionCount}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
