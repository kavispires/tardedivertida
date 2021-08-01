import React, { useState } from 'react';
import PropTypes from 'prop-types';
// Hooks
import { useIsUserReady, useWhichPlayerIsThe, useIsUserThe, useAPICall } from '../../../hooks';
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
import SuggestionStep from './SuggestionStep';
import { WritingRules } from './RulesBlobs';

function PhaseSuggest({ state, players, info }) {
  const isUserReady = useIsUserReady(players, state);
  const [step, setStep] = useState(0);
  const guesser = useWhichPlayerIsThe('guesser', state, players);
  const isUserTheGuesser = useIsUserThe('guesser', state);

  const onSendSuggestions = useAPICall({
    apiFunction: UE_SO_ISSO_API.submitSuggestions,
    actionName: 'submit-suggestion',
    onBeforeCall: () => setStep(2),
    onError: () => setStep(1),
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
        <PhaseAnnouncement
          type="writing"
          title="Escreva uma dica!"
          onClose={() => setStep(1)}
          currentRound={state?.round}
        >
          <WritingRules />
          {isUserTheGuesser && (
            <Instruction contained>Se você é o adivinhador, relaxe e aguarde...</Instruction>
          )}
        </PhaseAnnouncement>

        {/* Step 1 */}
        <Step fullWidth>
          <ViewIf isVisible={isUserTheGuesser}>
            <WaitingRoom
              players={players}
              title="Você é o(a) adivinhador(a)"
              instruction="Aguarde enquanto os outros jogadores escrevem dicas para você adivinhar."
            />
          </ViewIf>

          <ViewIf isVisible={!isUserTheGuesser}>
            <SuggestionStep
              guesser={guesser}
              onSendSuggestions={onSendSuggestions}
              secretWord={state.secretWord}
              suggestionsNumber={state.suggestionsNumber}
            />
          </ViewIf>
        </Step>

        {/* Step 2 */}
        <WaitingRoom players={players} title="Pronto!" instruction="Vamos aguardar os outros jogadores." />
      </StepSwitcher>
    </PhaseContainer>
  );
}

PhaseSuggest.propTypes = {
  info: PropTypes.object,
  players: PropTypes.object,
  state: PropTypes.shape({
    phase: PropTypes.string,
    secretWord: PropTypes.any,
    suggestionsNumber: PropTypes.any,
  }),
};

export default PhaseSuggest;
