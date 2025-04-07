// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
// Icons
import { GuessIcon } from 'icons/GuessIcon';
// Components
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { ViewOr } from 'components/views';
// Internal
import { useOnSendGuessAPIRequest, useOnSubmitOutcomeAPIRequest } from './utils/api-requests';
import { UE_SO_ISSO_PHASES } from './utils/constants';
import { StepGuessing } from './StepGuessing';
import { StepWaitingForGuess } from './StepWaitingForGuess';

export function PhaseGuess({ state, players, meta }: PhaseProps) {
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
      <Translate pt="Hora de adivinhar a palavra secreta!" en="Time to guess the secret word!" />
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer phase={state?.phase} allowedPhase={UE_SO_ISSO_PHASES.GUESS}>
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <ViewOr condition={isUserTheGuesser}>
          <StepGuessing
            guesser={guesser}
            secretWord={state.secretWord}
            onSubmitOutcome={onSubmitOutcome}
            onSendGuess={onSendGuess}
            validSuggestions={state.validSuggestions}
            announcement={announcement}
            timerEnabled={Boolean(meta.options?.withTimer)}
            hintsEnabled={Boolean(meta.options?.withHints)}
          />

          <StepWaitingForGuess
            guesser={guesser}
            validSuggestions={state.validSuggestions}
            secretWord={state.secretWord}
            announcement={announcement}
            timerEnabled={Boolean(meta.options?.withTimer)}
            hintsEnabled={Boolean(meta.options?.withHints)}
          />
        </ViewOr>
      </StepSwitcher>
    </PhaseContainer>
  );
}
