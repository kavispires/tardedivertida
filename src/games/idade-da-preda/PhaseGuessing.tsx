// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
// Icons
import { EvaluateIcon } from 'icons/EvaluateIcon';
// Components
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
// Internal
import type { PhaseGuessingState } from './utils/types';
import { IDADE_DA_PREDA_PHASES } from './utils/constants';
import { useOnSubmitGuessesAPIRequest } from './utils/api-requests';
import { StepGuess } from './StepGuess';

export function PhaseGuessing({ state, players, user }: PhaseProps<PhaseGuessingState>) {
  const { step, setStep } = useStep();
  const onSubmitGuesses = useOnSubmitGuessesAPIRequest(setStep);

  const announcement = (
    <PhaseAnnouncement
      icon={<EvaluateIcon />}
      title={
        <Translate
          pt="Adivinhação"
          en="Guessing"
        />
      }
      currentRound={state?.round?.current}
      type="overlay"
    />
  );

  return (
    <PhaseContainer
      phase={state?.phase}
      allowedPhase={IDADE_DA_PREDA_PHASES.GUESSING}
    >
      <StepSwitcher
        step={step}
        players={players}
      >
        {/* Step 1 */}
        <StepGuess
          user={user}
          players={players}
          announcement={announcement}
          basicConcepts={state.basicConcepts}
          concepts={state.concepts}
          round={state.round}
          items={state.items}
          pool={state.pool}
          newNames={state.newNames}
          onSubmitGuesses={onSubmitGuesses}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
