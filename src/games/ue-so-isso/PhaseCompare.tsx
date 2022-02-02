import { useState } from 'react';
// Hooks
import { useAPICall, useWhichPlayerIsThe, useLanguage } from '../../hooks';
// Resources & Utils
import { UE_SO_ISSO_API } from '../../adapters';
import { PHASES } from '../../utils/phases';
// Components
import {
  Instruction,
  PhaseAnnouncement,
  PhaseContainer,
  Step,
  StepSwitcher,
  Translate,
  ViewIf,
  WaitingRoom,
} from '../../components';
import StepCompareSuggestions from './StepCompareSuggestions';
import { ComparisonRules } from './RulesBlobs';
import { GuesserWaitingRoom } from './GuesserWaitingRoom';

function PhaseCompare({ state, players, info }: PhaseProps) {
  const { translate } = useLanguage();
  const [step, setStep] = useState(0);
  const [, isUserTheGuesser] = useWhichPlayerIsThe('guesserId', state, players);
  const [controller, isUserTheController] = useWhichPlayerIsThe('controllerId', state, players);

  const onValidateSuggestionsAPIRequest = useAPICall({
    apiFunction: UE_SO_ISSO_API.submitAction,
    actionName: 'validate-suggestions',
    onBeforeCall: () => setStep(2),
    onError: () => setStep(1),
    successMessage: translate('Validação enviada com sucesso!', 'Validation sent successfully!'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar a validação das sugestões',
      'Oops, the application failed to send the validation'
    ),
  });

  const onUpdateValidSuggestionsAPIRequest = useAPICall({
    apiFunction: UE_SO_ISSO_API.submitAction,
    actionName: 'validate-suggestions',
    successMessage: translate('Atualizado!', 'Updated!'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar atualizar',
      'Oops, the application failed to update'
    ),
  });

  const onValidateSuggestions = (payload: PlainObject) => {
    onValidateSuggestionsAPIRequest({
      action: 'SUBMIT_VALIDATION',
      ...payload,
    });
  };

  const onUpdateSuggestions = (payload: PlainObject) => {
    onUpdateValidSuggestionsAPIRequest({
      action: 'VALIDATE_SUGGESTION',
      ...payload,
    });
  };

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.UE_SO_ISSO.COMPARE}>
      <StepSwitcher step={step}>
        {/* Step 0 */}
        <PhaseAnnouncement
          type="verify-list"
          title={translate('Comparação de dicas!', 'Clue Check!')}
          onClose={() => setStep(1)}
          currentRound={state?.round?.current}
        >
          <ComparisonRules />
          {isUserTheGuesser && (
            <Instruction contained>
              <Translate
                pt="Já que você é o adivinhador, relaxe e aguarde... novamente"
                en="Since you're the guesser, just relax and wait... again"
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
                pt: 'validam dicas',
                en: 'validate the clues',
              }}
            />
          </ViewIf>

          <ViewIf isVisible={!isUserTheGuesser}>
            <StepCompareSuggestions
              controller={controller}
              isUserTheController={isUserTheController}
              secretWord={state.secretWord}
              suggestions={state.suggestions}
              players={players}
              onValidateSuggestions={onValidateSuggestions}
              onUpdateSuggestions={onUpdateSuggestions}
            />
          </ViewIf>
        </Step>

        {/* Step 2 */}
        <WaitingRoom
          players={players}
          title={translate('Enviando a confirmação de dicas', 'Sending confirmation')}
          instruction="..."
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseCompare;
