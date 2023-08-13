// State & Hooks
import { useUser } from 'hooks/useUser';
import { useStep } from 'hooks/useStep';
import { useOnSubmitAnswerAPIRequest } from './utils/api-requests';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Icons
import { ChatIcon } from 'icons/ChatIcon';
// Components
import { StepSwitcher } from 'components/steps';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { Translate } from 'components/language';
import { StepAnswerTheQuestion } from './StepAnswerTheQuestion';

export function PhaseAnswer({ players, state, info }: PhaseProps) {
  const user = useUser(players, state);
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
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.TA_NA_CARA.ANSWERING}>
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
