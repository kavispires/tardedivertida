// Hooks
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
import { useStep } from 'hooks/useStep';
import { useOnSubmitValidationsAPIRequest, useOnValidateSuggestionAPIRequest } from './utils/api-requests';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Components
import { StepCompareSuggestions } from './StepCompareSuggestions';
import { ComparisonRules } from './components/RulesBlobs';
import { GuesserWaitingRoom } from './components/GuesserWaitingRoom';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
import { Translate } from 'components/language';
import { ViewOr } from 'components/views';
import { WaitingRoom } from 'components/players';
import { VerifyListIcon } from 'components/icons/VerifyListIcon';

function PhaseCompare({ state, players, info }: PhaseProps) {
  const { step, goToNextStep, setStep } = useStep(0);
  const [, isUserTheGuesser] = useWhichPlayerIsThe('guesserId', state, players);
  const [controller, isUserTheController] = useWhichPlayerIsThe('controllerId', state, players);

  const onValidateSuggestions = useOnSubmitValidationsAPIRequest(setStep);

  const onUpdateSuggestions = useOnValidateSuggestionAPIRequest();

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.UE_SO_ISSO.COMPARE}>
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <PhaseAnnouncement
          icon={<VerifyListIcon />}
          title={<Translate pt="Comparação de dicas!" en="Clue Check!" />}
          onClose={goToNextStep}
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
        <ViewOr condition={isUserTheGuesser}>
          <GuesserWaitingRoom
            players={players}
            instructionSuffix={{
              pt: 'validam dicas',
              en: 'validate the clues',
            }}
          />

          <StepCompareSuggestions
            controller={controller}
            isUserTheController={isUserTheController}
            secretWord={state.secretWord}
            suggestions={state.suggestions}
            players={players}
            onValidateSuggestions={onValidateSuggestions}
            onUpdateSuggestions={onUpdateSuggestions}
          />
        </ViewOr>

        {/* Step 2 */}
        <WaitingRoom
          players={players}
          title={<Translate pt="Enviando a confirmação de dicas" en="Sending confirmation" />}
          instruction="..."
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseCompare;
