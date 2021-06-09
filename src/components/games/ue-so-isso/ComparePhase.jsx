import React, { useState } from 'react';
import PropTypes from 'prop-types';
// Hooks
import { useIsUserThe, useAPICall, useWhichPlayerIsThe } from '../../../hooks';
// Resources & Utils
import { UE_SO_ISSO_API } from '../../../adapters';
import { PHASES } from '../../../utils/constants';
// Components
import PhaseContainer from '../../shared/PhaseContainer';
import WaitingRoom from '../../shared/WaitingRoom';
import StepSwitcher, { Step } from '../../shared/StepSwitcher';
import CompareSuggestionsStep from './CompareSuggestionsStep';
import View from '../../shared/View';

function ComparePhase({ state, players, info }) {
  const [step, setStep] = useState(0);
  const isUserTheGuesser = useIsUserThe('guesser', state);
  const isUserTheNextGuesser = useIsUserThe('nextGuesser', state);
  const nextGuesser = useWhichPlayerIsThe('nextGuesser', state, players);

  const onValidateSuggestions = useAPICall({
    apiFunction: UE_SO_ISSO_API.submitValidation,
    actionName: 'validate-suggestions',
    onBeforeCall: () => setStep(1),
    onError: () => setStep(0),
    successMessage: 'Validação enviada com sucesso!',
    errorMessage: 'Vixi, o aplicativo encontrou um erro ao tentar enviar a confirmação das sugestões',
  });

  // TODO: Add modal

  return (
    <PhaseContainer
      info={info}
      phase={state?.phase}
      allowedPhase={PHASES.UE_SO_ISSO.COMPARE}
      className="u-compare-phase"
    >
      <StepSwitcher step={step}>
        {/* Step 0 */}
        <Step fullWidth>
          <View visibleIf={isUserTheGuesser}>
            <WaitingRoom
              players={players}
              title="Você é o(a) adivinhador(a)"
              instruction="Aguarde os outros jogadores selecionarem as dicas válidas."
            />
          </View>

          <View visibleIf={!isUserTheGuesser}>
            <CompareSuggestionsStep
              nextGuesser={nextGuesser}
              isUserTheNextGuesser={isUserTheNextGuesser}
              secretWord={state.secretWord}
              suggestions={state.suggestions}
              players={players}
              onValidateSuggestions={onValidateSuggestions}
            />
          </View>
        </Step>

        {/* Step 1 */}
        <WaitingRoom players={players} title="Enviando a confirmação de sugestões" instruction="Aguarde..." />
      </StepSwitcher>
    </PhaseContainer>
  );
}

ComparePhase.propTypes = {
  info: PropTypes.object,
  players: PropTypes.object,
  state: PropTypes.object,
};

export default ComparePhase;
