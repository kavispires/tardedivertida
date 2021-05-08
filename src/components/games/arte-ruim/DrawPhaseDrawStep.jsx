import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTimer } from 'react-timer-hook';
// Utils
import { inNSeconds } from '../../../utils';
// Components
import DrawingCanvas from './DrawingCanvas';
import Card from '../../cards/Card';

function DrawPhaseDrawStep({ secretCard, onSubmitDrawing }) {
  const [lines, setLines] = useState([]);

  const { seconds } = useTimer({
    expiryTimestamp: inNSeconds(11),
    autoStart: true,
    onExpire: () => onSubmitDrawing(lines),
  });

  return (
    <div className="a-draw-phase-draw-step">
      <Card
        size="large"
        header="Desenhe"
        footer={Array(secretCard?.level).fill('•').join('')}
        className="a-draw-phase-draw-step__card"
        color="yellow"
      >
        {secretCard?.text}
        <span className="a-draw-phase-draw-step__timer">{seconds - 1}</span>
      </Card>
      <DrawingCanvas lines={lines} setLines={setLines} />
    </div>
  );
}

DrawPhaseDrawStep.propTypes = {
  secretCard: PropTypes.shape({
    text: PropTypes.string,
    level: PropTypes.number,
  }).isRequired,
  onSubmitDrawing: PropTypes.func.isRequired,
};

export default DrawPhaseDrawStep;
