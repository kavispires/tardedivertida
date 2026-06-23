// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from '@hooks/useStep';
// Icons
import { EvaluateIcon } from '@icons/EvaluateIcon';
// Components
import { Translate } from '@components/language/Translate';
import { PhaseAnnouncement } from '@components/phases/PhaseAnnouncement';
import { PhaseContainer } from '@components/phases/PhaseContainer';
import { StepSwitcher } from '@components/steps/StepSwitcher';
import { Instruction } from '@components/text/Instruction';
// Internal
import type { PhaseGuessingState } from './utils/types';
import { COLEGAS_DE_QUARTO_PHASES } from './utils/constants';
import { useOnSubmitGuessesAPIRequest } from './utils/api-requests';
import { StepGuess } from './StepGuess';

export function PhaseGuessing({ players, state, user }: PhaseProps<PhaseGuessingState>) {
  const { step, setStep } = useStep();
  const onSubmitGuesses = useOnSubmitGuessesAPIRequest(setStep);

  const announcement = (
    <PhaseAnnouncement
      icon={<EvaluateIcon />}
      title={
        <Translate
          pt="Adivinhe!"
          en="Guess!"
        />
      }
      currentRound={state?.round?.current}
      type="overlay"
    >
      <Instruction>
        <Translate
          pt={<>Adivinhe todos grupos de uma dica com seu par de objetos.</>}
          en={<>Guess all groups from a clue with your pair of things.</>}
        />
      </Instruction>
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer
      phase={state?.phase}
      allowedPhase={COLEGAS_DE_QUARTO_PHASES.GUESSING}
    >
      <StepSwitcher
        step={step}
        players={players}
        conditions={[!!user?.assignedPairs]}
      >
        {/* Step 1 */}
        <StepGuess
          user={user}
          players={players}
          announcement={announcement}
          board={state.board}
          happiness={state.happiness}
          round={state.round}
          onSubmitGuesses={onSubmitGuesses}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
