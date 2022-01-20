import { useState } from 'react';
// Hooks
import { useLanguage, useUser } from '../../hooks';
import { useOnSubmitAnswersAPIRequest } from './api-requests';
// Resources & Utils
import { PHASES } from '../../utils/phases';
// Components
import { PhaseAnnouncement, PhaseContainer, StepSwitcher, translate } from '../../components';
import { AnsweringStep } from './AnsweringStep';
import { AnsweringRules } from './RulesBlobs';

function PhaseEverybodyWrites({ state, players, info }: PhaseProps) {
  const language = useLanguage();
  const [step, setStep] = useState(0);
  const user = useUser(players);

  const onSubmitAnswers = useOnSubmitAnswersAPIRequest(setStep);

  return (
    <PhaseContainer
      info={info}
      phase={state?.phase}
      allowedPhase={PHASES.MENTE_COLETIVA.EVERYBODY_WRITES}
      className="u-word-selection-phase"
    >
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <PhaseAnnouncement
          type="writing"
          title={translate('Todos Respondem', 'Everybody Writes', language)}
          onClose={() => setStep(1)}
          currentRound={state?.round?.current}
          duration={state?.round?.current < 3 ? 20 : undefined}
        >
          <AnsweringRules />
        </PhaseAnnouncement>

        {/* Step 1 */}
        <AnsweringStep
          currentQuestion={state.currentQuestion}
          players={players}
          roundType={state.roundType}
          onSubmitAnswers={onSubmitAnswers}
          user={user}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseEverybodyWrites;
