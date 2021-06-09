import React, { useState } from 'react';
import PropTypes from 'prop-types';
// Hooks
import { useIsUserReady, useWhichPlayerIsThe, useIsUserThe, useAPICall } from '../../../hooks';
// Resources & Utils
import { UE_SO_ISSO_API } from '../../../adapters';
import { PHASES } from '../../../utils/constants';
// Components
import PhaseContainer from '../../shared/PhaseContainer';
import WaitingRoom from '../../shared/WaitingRoom';
import StepSwitcher, { Step } from '../../shared/StepSwitcher';
import SuggestionStep from './SuggestionStep';
import View from '../../shared/View';

function SuggestPhase({ state, players, info }) {
  const isUserReady = useIsUserReady(players, state);
  const [step, setStep] = useState(0);
  const guesser = useWhichPlayerIsThe('guesser', state, players);
  const isUserTheGuesser = useIsUserThe('guesser', state);

  const onSendSuggestions = useAPICall({
    apiFunction: UE_SO_ISSO_API.submitSuggestions,
    actionName: 'submit-suggestion',
    onBeforeCall: () => setStep(1),
    onError: () => setStep(0),
    successMessage:
      'Sugestão enviada com successo! Aguarde enquanto os outros participantes escrevem suas dicas',
    errorMessage: 'Vixi, o aplicativo encontrou um erro ao tentar enviar sua(s) dica(s)',
  });

  return (
    <PhaseContainer
      info={info}
      phase={state?.phase}
      allowedPhase={PHASES.UE_SO_ISSO.SUGGEST}
      className="word-selection-phase"
    >
      <StepSwitcher step={step} conditions={[!isUserReady]}>
        {/* Step 0 */}
        <Step fullWidth>
          <View visibleIf={isUserTheGuesser}>
            <WaitingRoom
              players={players}
              title="Você é o(a) adivinhador(a)"
              instruction="Aguarde enquanto os outros jogadores escrevem dicas para você adivinhar."
            />
          </View>

          <View visibleIf={!isUserTheGuesser}>
            <SuggestionStep
              guesser={guesser}
              onSendSuggestions={onSendSuggestions}
              secretWord={state.secretWord}
              suggestionsNumber={state.suggestionsNumber}
            />
          </View>
        </Step>

        {/* Step 1 */}
        <WaitingRoom players={players} title="Pronto!" instruction="Vamos aguardar os outros joadores." />
      </StepSwitcher>
    </PhaseContainer>
  );
}

SuggestPhase.propTypes = {
  info: PropTypes.object,
  players: PropTypes.object,
  state: PropTypes.object,
};

export default SuggestPhase;
