// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
import { useUser } from 'hooks/useUser';
// Icons
import { PuzzleIcon } from 'icons/PuzzleIcon';
// Components
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
// Internal
import type { PhaseConceptsRevealState } from './utils/types';
import { IDADE_DA_PREDA_PHASES } from './utils/constants';
import { useOnMakeReady } from './utils/api-requests';
import { StepNewConcepts } from './StepNewConcepts';

export function PhaseConceptsReveal({ players, state }: PhaseProps<PhaseConceptsRevealState>) {
  const user = useUser(players, state);
  const { step, setStep } = useStep();
  const onMakeMeReady = useOnMakeReady(setStep);

  const announcement = (
    <PhaseAnnouncement
      icon={<PuzzleIcon />}
      title={<Translate pt="Novos Conceitos" en="New Concepts" />}
      currentRound={state?.round?.current}
      type="overlay"
    />
  );

  return (
    <PhaseContainer phase={state?.phase} allowedPhase={IDADE_DA_PREDA_PHASES.CONCEPTS_REVEAL}>
      <StepSwitcher step={step} players={players}>
        {/* Step 1 */}
        <StepNewConcepts
          user={user}
          players={players}
          announcement={announcement}
          basicConcepts={state.basicConcepts}
          concepts={state.concepts}
          round={state.round}
          items={state.items}
          onMakeMeReady={onMakeMeReady}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
