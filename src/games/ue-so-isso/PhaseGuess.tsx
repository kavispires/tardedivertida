import { useEffect } from 'react';
// Hooks
import { useLoading } from 'hooks/useLoading';
import { useStep } from 'hooks/useStep';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
import { useOnSendGuessAPIRequest, useOnSubmitOutcomeAPIRequest } from './utils/api-requests';
import { useVIP } from 'hooks/useVIP';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Icons
import { GuessIcon } from 'icons/GuessIcon';
// Components
import { StepSwitcher } from 'components/steps';
import { StepGuessing } from './StepGuessing';
import { StepGuessVerification } from './StepGuessVerification';
import { GuessingRules } from './components/RulesBlobs';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { Translate } from 'components/language';

function PhaseGuess({ state, players, info }: PhaseProps) {
  const { isLoading } = useLoading();
  const { step, setStep } = useStep(0);
  const isVIP = useVIP();
  const [guesser, isUserTheGuesser] = useWhichPlayerIsThe('guesserId', state, players);
  const [controller, isUserTheController] = useWhichPlayerIsThe('controllerId', state, players);

  const onSubmitOutcome = useOnSubmitOutcomeAPIRequest(setStep);

  const onSendGuess = useOnSendGuessAPIRequest();

  // If guess is present in the state, move to the next step
  useEffect(() => {
    if (state?.guess) {
      setStep(1);
    }
  }, [state, setStep]);

  const announcement = (
    <PhaseAnnouncement
      icon={<GuessIcon />}
      title={<Translate pt="Adivinhação" en="Guessing" />}
      currentRound={state?.round?.current}
      type="overlay"
    >
      <GuessingRules guesserName={guesser.name} />
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.UE_SO_ISSO.GUESS}>
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}

        {/* Step 1 */}
        <StepGuessing
          guesser={guesser}
          isUserTheGuesser={isUserTheGuesser}
          onSubmitOutcome={onSubmitOutcome}
          onSendGuess={onSendGuess}
          validSuggestions={state.validSuggestions}
          secretWord={state.secretWord}
          announcement={announcement}
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
          isVIP={isVIP}
          isLoading={isLoading}
          announcement={announcement}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseGuess;
