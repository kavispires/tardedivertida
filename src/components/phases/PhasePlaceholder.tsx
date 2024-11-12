// Types
import type { GameState } from 'types/game';
// Internal
import { PhaseContainer } from './index';

type PhasePlaceholderProps = {
  state: GameState;
};

export function PhasePlaceholder({ state }: PhasePlaceholderProps) {
  return (
    <PhaseContainer phase="ANY" allowedPhase="ANY" className="phase-placeholder">
      {state?.phase ?? 'Unknown Phase'}
    </PhaseContainer>
  );
}
