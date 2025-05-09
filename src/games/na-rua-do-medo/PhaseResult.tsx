// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useUser } from 'hooks/useUser';
// Components
import { PhaseContainer } from 'components/phases';
// Internal
import { NA_RUA_DO_MEDO_PHASES } from './utils/constants';
import { StepResult } from './StepResult';

export function PhaseResult({ state, players }: PhaseProps) {
  const user = useUser(players, state);

  return (
    <PhaseContainer phase={state?.phase} allowedPhase={NA_RUA_DO_MEDO_PHASES.RESULT}>
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
