import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
// Hooks
import { useGlobalState, useLoading, useWhichPlayerIsThe, useIsUserThe, useAPICall } from '../../../hooks';
// Resources & Utils
import { UE_SO_ISSO_API } from '../../../adapters';
import { PHASES } from '../../../utils/constants';
// Components
import { PhaseContainer, StepSwitcher, WaitingRoom } from '../../shared';
import GuessingStep from './GuessingStep';
import GuessVerificationStep from './GuessVerificationStep';

function GuessPhase({ state, players, info }) {
  const [isLoading] = useLoading();
  const [isAdmin] = useGlobalState('isAdmin');
  const [step, setStep] = useState(0);
  const guesser = useWhichPlayerIsThe('guesser', state, players);
  const nextGuesser = useWhichPlayerIsThe('nextGuesser', state, players);
  const isUserTheNextGuesser = useIsUserThe('nextGuesser', state);
  const isUserTheGuesser = useIsUserThe('guesser', state);

  const onConfirmGuess = useAPICall({
    apiFunction: UE_SO_ISSO_API.confirmGuess,
    actionName: 'guess',
    onBeforeCall: () => setStep(2),
    onError: () => setStep(0),
    successMessage: 'Resultado enviado com sucesso!',
    errorMessage: 'Vixi, o aplicativo encontrou um erro ao tentar enviar o resultado',
  });

  const onSendGuess = useAPICall({
    apiFunction: UE_SO_ISSO_API.sendGuess,
    actionName: 'guess',
    successMessage: 'Resultado enviado com sucesso!',
    errorMessage: 'Vixi, o aplicativo encontrou um erro ao tentar enviar o resultado',
  });

  // If guess is present in the state, move to the next step
  useEffect(() => {
    if (state?.guess) {
      setStep(1);
    }
  }, [state]);

  return (
    <PhaseContainer
      info={info}
      phase={state?.phase}
      allowedPhase={PHASES.UE_SO_ISSO.GUESS}
      className="u-word-guess-phase"
    >
      <StepSwitcher step={step}>
        {/* Step 0 */}
        <GuessingStep
          guesser={guesser}
          isUserTheGuesser={isUserTheGuesser}
          onConfirmGuess={onConfirmGuess}
          onSendGuess={onSendGuess}
          validSuggestions={state.validSuggestions}
          secretWord={state.secretWord}
          players={players}
        />

        {/* Step 1 */}
        <GuessVerificationStep
          guesser={guesser}
          guess={state.guess}
          isUserTheGuesser={isUserTheGuesser}
          onConfirmGuess={onConfirmGuess}
          validSuggestions={state.validSuggestions}
          secretWord={state.secretWord}
          nextGuesser={nextGuesser}
          isUserTheNextGuesser={isUserTheNextGuesser}
          isAdmin={isAdmin}
          isLoading={isLoading}
        />

        {/* Step 2 */}
        <WaitingRoom players={players} title="Enviando a confirmação de sugestões" instruction="Aguarde..." />
      </StepSwitcher>
    </PhaseContainer>
  );
}

GuessPhase.propTypes = {
  info: PropTypes.object,
  players: PropTypes.object,
  state: PropTypes.object,
};

export default GuessPhase;
