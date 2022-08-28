import { useEffect } from 'react';
// Hooks
import { useGlobalState } from 'hooks/useGlobalState';
import { useLanguage } from 'hooks/useLanguage';
import { useLoading } from 'hooks/useLoading';
import { useStep } from 'hooks/useStep';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
import { useOnSendGuessAPIRequest, useOnSubmitOutcomeAPIRequest } from './utils/api-requests';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Components
import { StepSwitcher } from 'components/steps';
import { StepGuessing } from './StepGuessing';
import { StepGuessVerification } from './StepGuessVerification';
import { GuessingRules } from './components/RulesBlobs';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { GuessIcon } from 'components/icons/GuessIcon';

function PhaseGuess({ state, players, info }: PhaseProps) {
  const { isLoading } = useLoading();
  const { translate } = useLanguage();
  const { step, goToNextStep, setStep } = useStep(0);
  const [isAdmin] = useGlobalState('isAdmin');
  const [guesser, isUserTheGuesser] = useWhichPlayerIsThe('guesserId', state, players);
  const [controller, isUserTheController] = useWhichPlayerIsThe('controllerId', state, players);

  const onSubmitOutcome = useOnSubmitOutcomeAPIRequest(setStep);

  const onSendGuess = useOnSendGuessAPIRequest();

  // If guess is present in the state, move to the next step
  useEffect(() => {
    if (state?.guess) {
      setStep(2);
    }
  }, [state, setStep]);

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.UE_SO_ISSO.GUESS}>
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <PhaseAnnouncement
          icon={<GuessIcon />}
          title={translate('Adivinhação', 'Guessing')}
          onClose={goToNextStep}
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
