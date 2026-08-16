import { Fragment } from 'react/jsx-runtime';
// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from '@hooks/useStep';
import { useWhichPlayerIsThe } from '@hooks/useWhichPlayerIsThe';
// Icons
import { GuessIcon } from '@icons/GuessIcon';
// Components
import { Translate } from '@components/language/Translate';
import { Surface } from '@components/layout/Surface';
import { PhaseAnnouncement } from '@components/phases/PhaseAnnouncement';
import { PhaseContainer } from '@components/phases/PhaseContainer';
import { StepSwitcher } from '@components/steps/StepSwitcher';
import { ViewIf } from '@components/views/ViewIf';
// Internal
import { useOnSendGuessAPIRequest, useOnSubmitOutcomeAPIRequest } from './utils/api-requests';
import { UE_SO_ISSO_PHASES } from './utils/constants';
import type { PhaseGuessState } from './utils/types';
import { StepGuessing } from './StepGuessing';
import { StepWaitingForGuess } from './StepWaitingForGuess';

export function PhaseGuess({ state, players, meta }: PhaseProps<PhaseGuessState>) {
  const { step, setStep } = useStep(0);
  const [guesser, isUserTheGuesser] = useWhichPlayerIsThe('guesserId', state, players);

  const onSubmitOutcome = useOnSubmitOutcomeAPIRequest(setStep);
  const onSendGuess = useOnSendGuessAPIRequest();

  const announcement = (
    <PhaseAnnouncement
      icon={<GuessIcon />}
      title={
        <Translate
          pt="Adivinhação"
          en="Guessing"
        />
      }
      currentRound={state?.round?.current}
      type="overlay"
      duration={4}
    >
      <Surface>
        <Translate
          pt="Hora de adivinhar a palavra secreta!"
          en="Time to guess the secret word!"
        />
      </Surface>
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer
      phase={state?.phase}
      allowedPhase={UE_SO_ISSO_PHASES.GUESS}
    >
      <StepSwitcher
        step={step}
        players={players}
      >
        {/* Step 0 */}
        <Fragment>
          <ViewIf condition={isUserTheGuesser}>
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
          </ViewIf>
          <ViewIf condition={!isUserTheGuesser}>
            <StepWaitingForGuess
              guesser={guesser}
              validSuggestions={state.validSuggestions}
              secretWord={state.secretWord}
              announcement={announcement}
              timerEnabled={Boolean(meta.options?.withTimer)}
              hintsEnabled={Boolean(meta.options?.withHints)}
            />
          </ViewIf>
        </Fragment>
      </StepSwitcher>
    </PhaseContainer>
  );
}
