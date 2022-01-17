import { useEffect, useState } from 'react';
// Hooks
import { useGlobalState, useLoading, useWhichPlayerIsThe, useAPICall, useLanguage } from '../../hooks';
// Resources & Utils
import { UE_SO_ISSO_API } from '../../adapters';
import { PHASES } from '../../utils/phases';
// Components
import { PhaseAnnouncement, PhaseContainer, StepSwitcher, translate } from '../../components';
import StepGuessing from './StepGuessing';
import StepGuessVerification from './StepGuessVerification';
import { GuessingRules } from './RulesBlobs';

function PhaseGuess({ state, players, info }: PhaseProps) {
  const [isLoading] = useLoading();
  const language = useLanguage();
  const [isAdmin] = useGlobalState('isAdmin');
  const [step, setStep] = useState(0);
  const [guesser, isUserTheGuesser] = useWhichPlayerIsThe('guesserId', state, players);
  const [controller, isUserTheController] = useWhichPlayerIsThe('controllerId', state, players);

  const onSubmitOutcomeAPIRequest = useAPICall({
    apiFunction: UE_SO_ISSO_API.submitAction,
    actionName: 'outcome',
    onBeforeCall: () => setStep(3),
    onError: () => setStep(0),
    successMessage: translate('Resultado enviado com sucesso!', 'Outcome sent successfully!', language),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar o resultado',
      'Oops, the application failed to submit the outcome',
      language
    ),
  });

  const onSendGuessAPIRequest = useAPICall({
    apiFunction: UE_SO_ISSO_API.submitAction,
    actionName: 'validate-suggestions',
    successMessage: translate('Chute enviado!', 'Guess sent!', language),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar atualizar',
      'Oops, the application failed to update',
      language
    ),
  });

  const onSubmitOutcome = (payload: PlainObject) => {
    onSubmitOutcomeAPIRequest({
      action: 'SUBMIT_OUTCOME',
      ...payload,
    });
  };

  const onSendGuess = (payload: PlainObject) => {
    onSendGuessAPIRequest({
      action: 'SEND_GUESS',
      ...payload,
    });
  };

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
          title={translate('Adivinhação', 'Guessing', language)}
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
