import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTimer } from 'react-timer-hook';
// Components
import DrawingCanvas from './DrawingCanvas';

function DrawPhaseStepTwo({ secretCard, onSubmitDrawing }) {
  const [lines, setLines] = useState([]);

  const { seconds } = useTimer({
    expiryTimestamp: Date.now() + 10000,
    autoStart: true,
    onExpire: () => onSubmitDrawing(lines),
  });

  return (
    <div className="draw-phase-step-two">
      <div className="draw-phase-step-two__card">
        <span className="draw-phase-step-two__card-title">Desenhe</span>
        <span className="draw-phase-step-two__card-text">{secretCard?.text}</span>
        <span className="draw-phase-step-two__card-level">{Array(secretCard?.level).fill('•')}</span>
        <span className="draw-phase-step-two__timer">{seconds}s</span>
      </div>

      <DrawingCanvas lines={lines} setLines={setLines} />
    </div>
  );
}

DrawPhaseStepTwo.propTypes = {
  secretCard: PropTypes.shape({
    text: PropTypes.string,
    level: PropTypes.number,
  }).isRequired,
  onSubmitDrawing: PropTypes.func.isRequired,
};

export default DrawPhaseStepTwo;
