// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useUser } from 'hooks/useUser';
// Utils
import { PHASES } from 'utils/phases';
// Components
import { PhaseContainer } from 'components/phases';
// Internal
import { StepResult } from './StepResult';

export function PhaseResult({ state, players }: PhaseProps) {
  const user = useUser(players, state);

  return (
    <PhaseContainer phase={state?.phase} allowedPhase={PHASES.NA_RUA_DO_MEDO.RESULT}>
      {/* Step 1 */}
      <StepResult
        players={players}
        street={state.street}
        currentCard={state.currentCard}
        candySidewalk={state.candySidewalk}
        cashedInCandy={state.cashedInCandy}
        candyInHand={state.candyInHand}
        user={user}
        alreadyAtHomePlayerIds={state.alreadyAtHomePlayerIds}
        continuingPlayerIds={state.continuingPlayerIds}
        goingHomePlayerIds={state.goingHomePlayerIds}
      />
    </PhaseContainer>
  );
}
