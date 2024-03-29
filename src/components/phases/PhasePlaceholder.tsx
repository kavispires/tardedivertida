// Types
import type { GameInfo } from 'types/game-info';
import type { GameState } from 'types/game';
// Components
import { PhaseContainer } from './index';

type PhasePlaceholderProps = {
  info: GameInfo;
  state: GameState;
};

export function PhasePlaceholder({ info, state }: PhasePlaceholderProps) {
  return (
    <PhaseContainer info={info} phase="ANY" allowedPhase="ANY" className="phase-placeholder">
      {state?.phase ?? 'Unknown Phase'}
    </PhaseContainer>
  );
}
