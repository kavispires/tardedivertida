import PropTypes from 'prop-types';
import React from 'react';
// Design Resources
import { Slider } from 'antd';
// State & Hooks
import { useGlobalState } from '../../hooks';
// Components
import { Translate } from '../shared';

export const CanvasResizer = () => {
  const [canvasSize, setCanvasSize] = useGlobalState('canvasSize');

  return (
    <div className="canvas-resizer">
      <div className="canvas-resizer__label">
        <Translate pt="Tamanho das Images" en="Image Size" />
      </div>
      <Slider
        className="canvas-resizer__slider"
        value={canvasSize ?? 100}
        min={150}
        max={500}
        step={50}
        onChange={setCanvasSize}
      />
    </div>
  );
};

CanvasResizer.propTypes = {
  numPlayers: PropTypes.number,
};
