import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTimer } from 'react-timer-hook';
// Utils
import { inNSeconds } from '../../utils';
// Components
import DrawingCanvas from './DrawingCanvas';
import Card from '../cards/Card';

function DrawPhaseStepTwo({ secretCard, onSubmitDrawing }) {
  const [lines, setLines] = useState([]);

  const { seconds } = useTimer({
    expiryTimestamp: inNSeconds(11),
    autoStart: true,
    onExpire: () => onSubmitDrawing(lines),
  });

  return (
    <div className="draw-phase-step-two">
      <Card
        size="large"
        header="Desenhe"
        footer={Array(secretCard?.level).fill('•').join('')}
        className="draw-phase-step-two__card"
        color="yellow"
      >
        {secretCard?.text}
        <span className="draw-phase-step-two__timer">{seconds - 1}s</span>
      </Card>
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
