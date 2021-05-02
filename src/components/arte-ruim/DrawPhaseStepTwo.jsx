import React, { useCallback, useEffect, useState } from 'react';
import { useTimer } from 'react-timer-hook';
// Design Resources

function DrawPhaseStepOne({ setStep, secretWord, onSubmitDrawing }) {
  const { seconds, minutes, hours, days, isRunning, start, pause, resume, restart } = useTimer({
    expiryTimestamp: Date.now() + 10000,
    autoStart: true,
    onExpire: () => alert('its over'),
  });
  return (
    <div className="draw-phase-step-two">
      <div className="draw-phase-step-two__card">
        <span className="draw-phase-step-two__card-title">Desenhe</span>
        <span className="draw-phase-step-two__card-text">{secretWord?.text}</span>
        <span className="draw-phase-step-two__card-level">{Array(secretWord?.level).fill('•')}</span>
        <span className="draw-phase-step-two__timer">{seconds}s</span>
      </div>

      <div className="draw-phase-step-two__canvas"></div>
    </div>
  );
}

export default DrawPhaseStepOne;
