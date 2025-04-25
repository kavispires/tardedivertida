// Types
import type { PhaseProps } from 'types/game';
// Internal
import { PhaseContainer } from './index';

export function PhasePlaceholder({ state }: PhaseProps) {
  return (
    <PhaseContainer phase="ANY" allowedPhase="ANY" className="phase-placeholder">
      {state?.phase ?? 'Unknown Phase'}
    </PhaseContainer>
  );
}
