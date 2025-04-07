// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
// Icons
import { VerifyListIcon } from 'icons/VerifyListIcon';
// Components
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { WaitingRoom } from 'components/players';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
import { ViewOr } from 'components/views';
// Internal
import { useOnSubmitValidationsAPIRequest, useOnValidateSuggestionAPIRequest } from './utils/api-requests';
import { UE_SO_ISSO_PHASES } from './utils/constants';
import { ComparisonRules } from './components/RulesBlobs';
import { GuesserWaitingRoom } from './components/GuesserWaitingRoom';
import { StepCompareSuggestions } from './StepCompareSuggestions';

export function PhaseCompare({ state, players }: PhaseProps) {
  const { step, setStep } = useStep(0);
  const [guesser, isUserTheGuesser] = useWhichPlayerIsThe('guesserId', state, players);
  const [controller, isUserTheController] = useWhichPlayerIsThe('controllerId', state, players);

  const onValidateSuggestions = useOnSubmitValidationsAPIRequest(setStep);

  const onUpdateSuggestions = useOnValidateSuggestionAPIRequest();

  const announcement = (
    <PhaseAnnouncement
      icon={<VerifyListIcon />}
      title={<Translate pt="Comparação de dicas!" en="Clue Check!" />}
      currentRound={state?.round?.current}
      type="overlay"
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
  );

  return (
    <PhaseContainer phase={state?.phase} allowedPhase={UE_SO_ISSO_PHASES.COMPARE}>
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <ViewOr condition={isUserTheGuesser}>
          <GuesserWaitingRoom
            players={players}
            instructionSuffix={{
              pt: 'validam dicas',
              en: 'validate the clues',
            }}
            phase={state.phase}
            guesser={guesser}
            turnOrder={state.gameOrder}
          />

          <StepCompareSuggestions
            controller={controller}
            isUserTheController={isUserTheController}
            secretWord={state.secretWord}
            suggestions={state.suggestions}
            players={players}
            onValidateSuggestions={onValidateSuggestions}
            onUpdateSuggestions={onUpdateSuggestions}
            announcement={announcement}
          />
        </ViewOr>

        {/* Step 1 */}
        <WaitingRoom
          players={players}
          title={<Translate pt="Enviando a confirmação de dicas" en="Sending confirmation" />}
          instruction="..."
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
