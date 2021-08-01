import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
// Hooks
import { useGlobalState, useLoading, useWhichPlayerIsThe, useIsUserThe, useAPICall } from '../../../hooks';
// Resources & Utils
import { UE_SO_ISSO_API } from '../../../adapters';
import { PHASES } from '../../../utils/constants';
// Components
import { PhaseAnnouncement, PhaseContainer, StepSwitcher, WaitingRoom } from '../../shared';
import GuessingStep from './GuessingStep';
import GuessVerificationStep from './GuessVerificationStep';
import { GuessingRules } from './RulesBlobs';

function PhaseGuess({ state, players, info }) {
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
    onBeforeCall: () => setStep(3),
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
      setStep(2);
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
        <PhaseAnnouncement
          type="guess"
          title="Adivinhação"
          onClose={() => setStep(1)}
          currentRound={state?.round}
        >
          <GuessingRules guesserName={guesser.name} />
        </PhaseAnnouncement>

        {/* Step 1 */}
        <GuessingStep
          guesser={guesser}
          isUserTheGuesser={isUserTheGuesser}
          onConfirmGuess={onConfirmGuess}
          onSendGuess={onSendGuess}
          validSuggestions={state.validSuggestions}
          secretWord={state.secretWord}
          players={players}
        />

        {/* Step 2 */}
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

        {/* Step 3 */}
        <WaitingRoom players={players} title="Enviando a confirmação de sugestões" instruction="Aguarde..." />
      </StepSwitcher>
    </PhaseContainer>
  );
}

PhaseGuess.propTypes = {
  info: PropTypes.object,
  players: PropTypes.object,
  state: PropTypes.shape({
    guess: PropTypes.any,
    phase: PropTypes.string,
    secretWord: PropTypes.any,
    validSuggestions: PropTypes.any,
  }),
};

export default PhaseGuess;
