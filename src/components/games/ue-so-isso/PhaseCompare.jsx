import React, { useState } from 'react';
import PropTypes from 'prop-types';
// Hooks
import { useIsUserThe, useAPICall, useWhichPlayerIsThe } from '../../../hooks';
// Resources & Utils
import { UE_SO_ISSO_API } from '../../../adapters';
import { PHASES } from '../../../utils/constants';
// Components
import {
  Instruction,
  PhaseAnnouncement,
  PhaseContainer,
  Step,
  StepSwitcher,
  ViewIf,
  WaitingRoom,
} from '../../shared';
import CompareSuggestionsStep from './CompareSuggestionsStep';
import { ComparisonRules } from './RulesBlobs';

function PhaseCompare({ state, players, info }) {
  const [step, setStep] = useState(0);
  const isUserTheGuesser = useIsUserThe('guesser', state);
  const isUserTheNextGuesser = useIsUserThe('nextGuesser', state);
  const nextGuesser = useWhichPlayerIsThe('nextGuesser', state, players);

  const onValidateSuggestions = useAPICall({
    apiFunction: UE_SO_ISSO_API.submitValidation,
    actionName: 'validate-suggestions',
    onBeforeCall: () => setStep(2),
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
        <PhaseAnnouncement
          type="verify-list"
          title="Comparação de Dicas"
          onClose={() => setStep(1)}
          currentRound={state?.round}
        >
          <ComparisonRules />
          {isUserTheGuesser && (
            <Instruction contained>Se você é o adivinhador, relaxe e aguarde... novamente</Instruction>
          )}
        </PhaseAnnouncement>

        {/* Step 1 */}
        <Step fullWidth>
          <ViewIf isVisible={isUserTheGuesser}>
            <WaitingRoom
              players={players}
              title="Você é o(a) adivinhador(a)"
              instruction="Aguarde os outros jogadores selecionarem as dicas válidas."
            />
          </ViewIf>

          <ViewIf isVisible={!isUserTheGuesser}>
            <CompareSuggestionsStep
              nextGuesser={nextGuesser}
              isUserTheNextGuesser={isUserTheNextGuesser}
              secretWord={state.secretWord}
              suggestions={state.suggestions}
              players={players}
              onValidateSuggestions={onValidateSuggestions}
            />
          </ViewIf>
        </Step>

        {/* Step 2 */}
        <WaitingRoom players={players} title="Enviando a confirmação de sugestões" instruction="Aguarde..." />
      </StepSwitcher>
    </PhaseContainer>
  );
}

PhaseCompare.propTypes = {
  info: PropTypes.object,
  players: PropTypes.object,
  state: PropTypes.shape({
    phase: PropTypes.string,
    secretWord: PropTypes.any,
    suggestions: PropTypes.any,
  }),
};

export default PhaseCompare;
