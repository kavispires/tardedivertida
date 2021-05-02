import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTimer } from 'react-timer-hook';
// Components
import DrawingCanvas from './DrawingCanvas';

function DrawPhaseStepTwo({ secretWord, onSubmitDrawing }) {
  const [lines, setLines] = useState([]);

  const { seconds } = useTimer({
    expiryTimestamp: Date.now() + 10000,
    autoStart: true,
    onExpire: () => onSubmitDrawing(lines),
  });

  console.log(secretWord);
  return (
    <div className="draw-phase-step-two">
      <div className="draw-phase-step-two__card">
        <span className="draw-phase-step-two__card-title">Desenhe</span>
        <span className="draw-phase-step-two__card-text">{secretWord?.text}</span>
        <span className="draw-phase-step-two__card-level">{Array(secretWord?.level).fill('•')}</span>
        <span className="draw-phase-step-two__timer">{seconds}s</span>
      </div>

      <DrawingCanvas lines={lines} setLines={setLines} />
    </div>
  );
}

DrawPhaseStepTwo.propTypes = {
  secretWord: PropTypes.shape({
    text: PropTypes.string,
    level: PropTypes.string,
  }).isRequired,
  onSubmitDrawing: PropTypes.func.isRequired,
};

export default DrawPhaseStepTwo;
