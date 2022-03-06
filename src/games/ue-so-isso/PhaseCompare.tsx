// Hooks
import { useWhichPlayerIsThe, useLanguage, useStep } from 'hooks';
// Resources & Utils

import { PHASES } from 'utils/phases';
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
} from 'components';
import StepCompareSuggestions from './StepCompareSuggestions';
import { ComparisonRules } from './RulesBlobs';
import { GuesserWaitingRoom } from './GuesserWaitingRoom';
import { useOnSubmitValidationsAPIRequest, useOnValidateSuggestionAPIRequest } from './api-requests';

function PhaseCompare({ state, players, info }: PhaseProps) {
  const { translate } = useLanguage();
  const { step, nextStep, setStep } = useStep(0);
  const [, isUserTheGuesser] = useWhichPlayerIsThe('guesserId', state, players);
  const [controller, isUserTheController] = useWhichPlayerIsThe('controllerId', state, players);

  const onValidateSuggestions = useOnSubmitValidationsAPIRequest(setStep);

  const onUpdateSuggestions = useOnValidateSuggestionAPIRequest();

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.UE_SO_ISSO.COMPARE}>
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <PhaseAnnouncement
          type="verify-list"
          title={translate('Comparação de dicas!', 'Clue Check!')}
          onClose={nextStep}
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
