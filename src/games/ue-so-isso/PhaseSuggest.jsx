import React, { useState } from 'react';
import PropTypes from 'prop-types';
// Hooks
import { useIsUserReady, useWhichPlayerIsThe, useAPICall, useLanguage } from '../../hooks';
// Resources & Utils
import { UE_SO_ISSO_API } from '../../adapters';
import { PHASES } from '../../utils/constants';
// Components
import {
  Instruction,
  PhaseAnnouncement,
  PhaseContainer,
  Step,
  StepSwitcher,
  Translate,
  translate,
  ViewIf,
  DefaultWaitingRoom,
} from '../../components/shared';
import SuggestionStep from './SuggestionStep';
import { WritingRules } from './RulesBlobs';
import { GuesserWaitingRoom } from './GuesserWaitingRoom';

function PhaseSuggest({ state, players, info }) {
  const isUserReady = useIsUserReady(players, state);
  const language = useLanguage();
  const [step, setStep] = useState(0);
  const [guesser, isUserTheGuesser] = useWhichPlayerIsThe('guesserId', state, players);

  const onSendSuggestionsAPIRequest = useAPICall({
    apiFunction: UE_SO_ISSO_API.submitAction,
    actionName: 'submit-suggestion',
    onBeforeCall: () => setStep(2),
    onError: () => setStep(1),
    successMessage: translate('Dicas enviada com sucesso!', 'Suggestion sent successfully!', language),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar suas dicas',
      'Oops, the application failed to send your votes',
      language
    ),
  });

  const onSendSuggestions = (payload) => {
    onSendSuggestionsAPIRequest({
      action: 'SUBMIT_SUGGESTIONS',
      ...payload,
    });
  };

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
          title={translate('Escreva uma dica!', 'Write a Clue!', language)}
          onClose={() => setStep(1)}
          currentRound={state?.round?.current}
        >
          <WritingRules />
          {isUserTheGuesser && (
            <Instruction contained>
              <Translate
                pt="Já que você é o adivinhador, relaxe e aguarde..."
                en="Since you're the guesser, just relax and wait..."
              />
            </Instruction>
          )}
        </PhaseAnnouncement>

        {/* Step 1 */}
        <Step fullWidth>
          <ViewIf isVisible={isUserTheGuesser}>
            <GuesserWaitingRoom
              players={players}
              instructionSuffix={{
                pt: 'escrevem dicas',
                en: 'write clues',
              }}
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
        <DefaultWaitingRoom players={players} />
      </StepSwitcher>
    </PhaseContainer>
  );
}

PhaseSuggest.propTypes = {
  info: PropTypes.object,
  players: PropTypes.object,
  state: PropTypes.shape({
    phase: PropTypes.string,
    round: PropTypes.shape({
      current: PropTypes.number,
      total: PropTypes.number,
    }),
    secretWord: PropTypes.any,
    suggestionsNumber: PropTypes.any,
  }),
};

export default PhaseSuggest;
