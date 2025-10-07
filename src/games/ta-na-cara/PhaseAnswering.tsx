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
import { StepAnswerTheQuestion } from './StepAnswerTheQuestion';

export function PhaseAnswer({ state, players, user }: PhaseProps) {
  const { step } = useStep();

  const onSubmitAnswer = useOnSubmitAnswerAPIRequest();

  const announcement = (
    <PhaseAnnouncement
      icon={<ChatIcon />}
      title={<Translate pt="Responda!" en="Answer the question!" />}
      currentRound={state?.round?.current}
      type="overlay"
      duration={4}
    ></PhaseAnnouncement>
  );

  return (
    <PhaseContainer phase={state?.phase} allowedPhase={TA_NA_CARA_PHASES.ANSWERING}>
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <StepAnswerTheQuestion
          announcement={announcement}
          players={players}
          user={user}
          turnOrder={state.turnOrder}
          charactersDict={state.charactersDict}
          charactersIds={state.charactersIds}
          questionId={state.currentQuestionId}
          questionsDict={state.questionsDict}
          onSubmitAnswer={onSubmitAnswer}
          activePlayerId={state.activePlayerId}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
