// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from '@hooks/useStep';
// Icons
import { WritingIcon } from '@icons/WritingIcon';
// Components
import { Translate } from '@components/language/Translate';
import { Surface } from '@components/layout/Surface';
import { PhaseAnnouncement } from '@components/phases/PhaseAnnouncement';
import { PhaseContainer } from '@components/phases/PhaseContainer';
import { StepSwitcher } from '@components/steps/StepSwitcher';
// Internal
import { useOnSubmitAnswersAPIRequest } from './utils/api-requests';
import { MENTE_COLETIVA_PHASES } from './utils/constants';
import type { PhaseEverybodyWritesState } from './utils/types';
import { AnsweringRules } from './components/RulesBlobs';
import { StepAnswering } from './StepAnswering';

export function PhaseEverybodyWrites({ state, players, meta, user }: PhaseProps<PhaseEverybodyWritesState>) {
  const { step, setStep } = useStep(0);

  const onSubmitAnswers = useOnSubmitAnswersAPIRequest(setStep);

  const announcement = (
    <PhaseAnnouncement
      icon={<WritingIcon />}
      title={
        <Translate
          pt="Todos Respondem"
          en="Everybody Writes"
        />
      }
      currentRound={state?.round?.current}
      duration={state?.round?.current === 1 ? 20 : undefined}
      type="overlay"
    >
      <AnsweringRules />
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer
      phase={state?.phase}
      allowedPhase={MENTE_COLETIVA_PHASES.EVERYBODY_WRITES}
    >
      <StepSwitcher
        step={step}
        players={players}
        waitingRoom={{
          content: <Surface contained>{Object.values(user?.answers ?? {}).join(', ')}</Surface>,
        }}
      >
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
