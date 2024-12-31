// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
import { useUser } from 'hooks/useUser';
// Utils
import { PHASES } from 'utils/phases';
// Icons
// Components
import { PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
// Internal
import { StepVerification } from './StepVerification';

export function PhaseVerification({ players, state }: PhaseProps) {
  const user = useUser(players, state);
  const { step } = useStep();

  return (
    <PhaseContainer phase={state?.phase} allowedPhase={PHASES.COMUNICACAO_DUO.VERIFICATION}>
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <StepVerification
          user={user}
          players={players}
          deckType={state.deckType}
          deck={state.deck}
          status={state.status}
          history={state.history}
          summary={state.summary}
          clueInputType={state.clueInputType}
          clue={state.clue}
          clueQuantity={state.clueQuantity}
          round={state.round}
          entryIdToAnimate={state.entryIdToAnimate}
          nextPhase={state.nextPhase}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
