// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from '@hooks/useStep';
import { useWhichPlayerIsThe } from '@hooks/useWhichPlayerIsThe';
// Icons
import { ChatIcon } from '@icons/ChatIcon';
// Components
import { Translate } from '@components/language/Translate';
import { PhaseAnnouncement } from '@components/phases/PhaseAnnouncement';
import { PhaseContainer } from '@components/phases/PhaseContainer';
import { StepSwitcher } from '@components/steps/StepSwitcher';
// Internal
import { useOnSubmitAnswerAPIRequest } from './utils/api-requests';
import { TA_NA_CARA_PHASES } from './utils/constants';
import type { PhaseAnsweringState } from './utils/types';
import { StepAnswerTheQuestion } from './StepAnswerTheQuestion';

export function PhaseAnswer({ state, players, user }: PhaseProps<PhaseAnsweringState>) {
  const { step } = useStep();
  const [activePlayer] = useWhichPlayerIsThe('activePlayerId', state, players);

  const onSubmitAnswer = useOnSubmitAnswerAPIRequest();

  const announcement = (
    <PhaseAnnouncement
      icon={<ChatIcon />}
      title={
        <Translate
          pt="Responda!"
          en="Answer the question!"
        />
      }
      currentRound={state?.round?.current}
      type="overlay"
      duration={4}
    />
  );

  return (
    <PhaseContainer
      phase={state?.phase}
      allowedPhase={TA_NA_CARA_PHASES.ANSWERING}
      hasRequiredData={!!user.targetPlayerId && !!user.guesserPlayerId}
    >
      <StepSwitcher
        step={step}
        players={players}
      >
        {/* Step 0 */}
        <StepAnswerTheQuestion
          announcement={announcement}
          players={players}
          user={user}
          activePlayer={activePlayer}
          turnOrder={state.turnOrder}
          characters={state.characters}
          questionsHistory={state.questionsHistory}
          onSubmitAnswer={onSubmitAnswer}
          currentQuestion={state.currentQuestion}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
