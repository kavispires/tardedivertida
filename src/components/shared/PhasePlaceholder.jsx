import React from 'react';
// Components
import PhaseContainer from './PhaseContainer';

function PhasePlaceholder({ info, state }) {
  return (
    <PhaseContainer info={info} phase="ANY" allowedPhase="ANY" className="phase-placeholder">
      {state?.phase ?? 'Unknown Phase'}
    </PhaseContainer>
  );
}

export default PhasePlaceholder;
