// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
import { useUser } from 'hooks/useUser';
import { useOnSubmitAnswersAPIRequest } from './utils/api-requests';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Icons
import { WritingIcon } from 'icons/WritingIcon';
// Components
import { StepSwitcher } from 'components/steps';
import { StepAnswering } from './StepAnswering';
import { AnsweringRules } from './components/RulesBlobs';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { Translate } from 'components/language';

export function PhaseEverybodyWrites({ state, players, info, meta }: PhaseProps) {
  const { step, setStep } = useStep(0);
  const user = useUser(players, state);

  const onSubmitAnswers = useOnSubmitAnswersAPIRequest(setStep);

  const announcement = (
    <PhaseAnnouncement
      icon={<WritingIcon />}
      title={<Translate pt="Todos Respondem" en="Everybody Writes" />}
      currentRound={state?.round?.current}
      duration={state?.round?.current < 3 ? 20 : undefined}
      type="overlay"
    >
      <AnsweringRules />
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.MENTE_COLETIVA.EVERYBODY_WRITES}>
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <StepAnswering
          announcement={announcement}
          currentQuestion={state.currentQuestion}
          players={players}
          roundType={state.roundType}
          onSubmitAnswers={onSubmitAnswers}
          user={user}
          pastureSize={state.pastureSize}
          timedAnswers={meta?.options?.timed}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
