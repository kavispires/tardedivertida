import React, { useCallback, useEffect, useState } from 'react';
// Design Resources

function DrawPhaseStepOne({ setStep, state, submitDrawing }) {
  return (
    <div className="draw-phase-step-two">
      <div className="draw-phase-step-two__card">
        <span className="draw-phase-step-two__card-title">Desenhe</span>
        <span className="draw-phase-step-two__card-text">Abóbora</span>
      </div>
      <div className="draw-phase-step-two__timer"></div>
      <div className="draw-phase-step-two__canvas"></div>
    </div>
  );
}

export default DrawPhaseStepOne;
