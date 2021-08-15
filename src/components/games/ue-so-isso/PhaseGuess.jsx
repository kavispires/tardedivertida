import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
// Hooks
import {
  useGlobalState,
  useLoading,
  useWhichPlayerIsThe,
  useIsUserThe,
  useAPICall,
  useLanguage,
} from '../../../hooks';
// Resources & Utils
import { UE_SO_ISSO_API } from '../../../adapters';
import { PHASES } from '../../../utils/constants';
// Components
import {
  PhaseAnnouncement,
  PhaseContainer,
  StepSwitcher,
  Translate,
  translate,
  WaitingRoom,
} from '../../shared';
import GuessingStep from './GuessingStep';
import GuessVerificationStep from './GuessVerificationStep';
import { GuessingRules } from './RulesBlobs';

function PhaseGuess({ state, players, info }) {
  const [isLoading] = useLoading();
  const language = useLanguage();
  const [isAdmin] = useGlobalState('isAdmin');
  const [step, setStep] = useState(0);
  const guesser = useWhichPlayerIsThe('guesser', state, players);
  const controller = useWhichPlayerIsThe('controller', state, players);
  const isUserTheController = useIsUserThe('controller', state);
  const isUserTheGuesser = useIsUserThe('guesser', state);

  const onSubmitOutcomeAPIRequest = useAPICall({
    apiFunction: UE_SO_ISSO_API.submitAction,
    actionName: 'outcome',
    onBeforeCall: () => setStep(3),
    onError: () => setStep(0),
    successMessage: translate('Resultado enviado com sucesso!', 'Outcome sent successfully!', language),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar o resultado',
      'Oops, the application fail to submit the outcome',
      language
    ),
  });

  const onSendGuessAPIRequest = useAPICall({
    apiFunction: UE_SO_ISSO_API.updateAction,
    actionName: 'validate-suggestions',
    successMessage: translate('Chute enviado!', 'Guess sent!', language),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar atualizar',
      'Oops, the application fail to update',
      language
    ),
  });

  const onSubmitOutcome = (payload) => {
    onSubmitOutcomeAPIRequest({
      action: 'SUBMIT_OUTCOME',
      ...payload,
    });
  };

  const onSendGuess = (payload) => {
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
          title={translate('Adivinhação', 'Guessing', language)}
          onClose={() => setStep(1)}
          currentRound={state?.round?.current}
        >
          <GuessingRules guesserName={guesser.name} />
        </PhaseAnnouncement>

        {/* Step 1 */}
        <GuessingStep
          guesser={guesser}
          isUserTheGuesser={isUserTheGuesser}
          onSubmitOutcome={onSubmitOutcome}
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
          onSubmitOutcome={onSubmitOutcome}
          validSuggestions={state.validSuggestions}
          secretWord={state.secretWord}
          controller={controller}
          isUserTheController={isUserTheController}
          isAdmin={isAdmin}
          isLoading={isLoading}
        />

        {/* Step 3 */}
        <WaitingRoom
          players={players}
          title={<Translate pt="Enviando..." en="Submitting..." string />}
          instruction="..."
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}

PhaseGuess.propTypes = {
  info: PropTypes.object,
  players: PropTypes.object,
  state: PropTypes.shape({
    guess: PropTypes.string,
    phase: PropTypes.string,
    round: PropTypes.shape({
      current: PropTypes.number,
      total: PropTypes.number,
    }),
    secretWord: PropTypes.any,
    validSuggestions: PropTypes.any,
  }),
};

export default PhaseGuess;
