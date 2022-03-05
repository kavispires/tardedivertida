import { useEffect, useState } from 'react';
// Hooks
import { useGlobalState, useLoading, useWhichPlayerIsThe, useLanguage } from 'hooks';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Components
import { PhaseAnnouncement, PhaseContainer, StepSwitcher } from 'components';
import StepGuessing from './StepGuessing';
import StepGuessVerification from './StepGuessVerification';
import { GuessingRules } from './RulesBlobs';
import { useOnSendGuessAPIRequest, useOnSubmitOutcomeAPIRequest } from './api-requests';

function PhaseGuess({ state, players, info }: PhaseProps) {
  const { isLoading } = useLoading();
  const { translate } = useLanguage();
  const [isAdmin] = useGlobalState('isAdmin');
  const [step, setStep] = useState(0);
  const [guesser, isUserTheGuesser] = useWhichPlayerIsThe('guesserId', state, players);
  const [controller, isUserTheController] = useWhichPlayerIsThe('controllerId', state, players);

  const onSubmitOutcome = useOnSubmitOutcomeAPIRequest(setStep);

  const onSendGuess = useOnSendGuessAPIRequest();

  // If guess is present in the state, move to the next step
  useEffect(() => {
    if (state?.guess) {
      setStep(2);
    }
  }, [state]);

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.UE_SO_ISSO.GUESS}>
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <PhaseAnnouncement
          type="guess"
          title={translate('Adivinhação', 'Guessing')}
          onClose={() => setStep(1)}
          currentRound={state?.round?.current}
        >
          <GuessingRules guesserName={guesser.name} />
        </PhaseAnnouncement>

        {/* Step 1 */}
        <StepGuessing
          guesser={guesser}
          isUserTheGuesser={isUserTheGuesser}
          onSubmitOutcome={onSubmitOutcome}
          onSendGuess={onSendGuess}
          validSuggestions={state.validSuggestions}
          secretWord={state.secretWord}
        />

        {/* Step 2 */}
        <StepGuessVerification
          guesser={guesser}
          guess={state.guess}
          isUserTheGuesser={isUserTheGuesser}
          onSubmitOutcome={onSubmitOutcome}
          validSuggestions={state.validSuggestions}
          secretWord={state.secretWord}
          controller={controller}
          isUserTheController={isUserTheController}
          isAdmin={isAdmin}
          isLoading={isLoading}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseGuess;
