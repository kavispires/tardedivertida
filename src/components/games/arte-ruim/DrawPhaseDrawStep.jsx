import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTimer } from 'react-timer-hook';
// Utils
import { inNSeconds } from '../../../utils';
// Components
import { Step } from '../../shared';
import { Card } from '../../cards';
import DrawingCanvas from './DrawingCanvas';

function DrawPhaseDrawStep({ secretCard, onSubmitDrawing }) {
  const [lines, setLines] = useState([]);

  const { seconds } = useTimer({
    expiryTimestamp: inNSeconds(11),
    autoStart: true,
    onExpire: () =>
      onSubmitDrawing({
        drawing: JSON.stringify(lines),
        cardId: secretCard.id,
      }),
  });

  return (
    <Step>
      <Card
        size="large"
        header="Desenhe"
        footer={Array(secretCard?.level).fill('•').join('')}
        className="a-draw-step__card"
        color="yellow"
      >
        {secretCard?.text}
        <span className="a-draw-step__timer">{seconds - 1}</span>
      </Card>
      <DrawingCanvas lines={lines} setLines={setLines} />
    </Step>
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
