// Hooks
import { useStep } from 'hooks/useStep';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
import { useOnSendGuessAPIRequest, useOnSubmitOutcomeAPIRequest } from './utils/api-requests';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Icons
import { GuessIcon } from 'icons/GuessIcon';
// Components
import { StepSwitcher } from 'components/steps';
import { StepGuessing } from './StepGuessing';
import { GuessingRules } from './components/RulesBlobs';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { Translate } from 'components/language';
import { ViewOr } from 'components/views';
import { StepWaitingForGuess } from './StepWaitingForGuess';

export function PhaseGuess({ state, players, info }: PhaseProps) {
  const { step, setStep } = useStep(0);
  const [guesser, isUserTheGuesser] = useWhichPlayerIsThe('guesserId', state, players);

  const onSubmitOutcome = useOnSubmitOutcomeAPIRequest(setStep);
  const onSendGuess = useOnSendGuessAPIRequest();

  const announcement = (
    <PhaseAnnouncement
      icon={<GuessIcon />}
      title={<Translate pt="Adivinhação" en="Guessing" />}
      currentRound={state?.round?.current}
      type="overlay"
    >
      <GuessingRules guesser={guesser} />
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.UE_SO_ISSO.GUESS}>
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <ViewOr condition={isUserTheGuesser}>
          <StepGuessing
            guesser={guesser}
            onSubmitOutcome={onSubmitOutcome}
            onSendGuess={onSendGuess}
            validSuggestions={state.validSuggestions}
            announcement={announcement}
          />

          <StepWaitingForGuess
            guesser={guesser}
            validSuggestions={state.validSuggestions}
            secretWord={state.secretWord}
            announcement={announcement}
          />
        </ViewOr>
      </StepSwitcher>
    </PhaseContainer>
  );
}
