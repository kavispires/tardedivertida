// Types
import type { PhaseProps } from 'types/game';
// Internal
import { PhaseContainer } from './PhaseContainer';

/**
 * Placeholder phase component that displays a generic message when a phase is not yet implemented
 */
export function PhasePlaceholder({ state }: PhaseProps) {
  return (
    <PhaseContainer
      phase="ANY"
      allowedPhase="ANY"
      className="phase-placeholder"
    >
      {state?.phase ?? 'Unknown Phase'}
    </PhaseContainer>
  );
}
