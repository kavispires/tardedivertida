// Types
import { PhaseProps } from 'types/game';
// Hooks
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
import { useStep } from 'hooks/useStep';
import { useOnSubmitValidationsAPIRequest, useOnValidateSuggestionAPIRequest } from './utils/api-requests';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Icons
import { VerifyListIcon } from 'icons/VerifyListIcon';
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

export function PhaseCompare({ state, players, info }: PhaseProps) {
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
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.UE_SO_ISSO.COMPARE}>
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
