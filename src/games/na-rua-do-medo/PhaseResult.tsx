// Hooks
import { useUser } from 'hooks/useUser';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Components
import { StepResult } from './StepResult';
import { PhaseContainer } from 'components/phases';

export function PhaseResult({ state, players, info }: PhaseProps) {
  const user = useUser(players, state);

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.NA_RUA_DO_MEDO.RESULT}>
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
