import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
// Design Resources
import { Slider } from 'antd';
// State & Hooks
import { useDimensions, useGlobalState } from '../../hooks';
// Components
import { Translate } from '../shared';

export const CanvasReSizer = ({ numPlayers = 5 }) => {
  const [canvasSize, setCanvasSize] = useGlobalState('canvasSize');
  const [cachedCanvasSize] = useGlobalState('cachedCanvasSize');
  const [width] = useDimensions();

  useEffect(() => {
    if (canvasSize === 250 || canvasSize !== cachedCanvasSize) {
      setCanvasSize(Math.round(width / numPlayers) - 30);
    }
  }, [width]); // eslint-disable-line

  return (
    <div className="canvas-resizer">
      <div className="canvas-resizer__label">
        <Translate pt="Tamanho das Images" en="Image Size" />
      </div>
      <Slider
        className="canvas-resizer__slider"
        defaultValue={canvasSize}
        min={100}
        max={500}
        step={50}
        onChange={setCanvasSize}
      />
    </div>
  );
};

CanvasReSizer.propTypes = {
  numPlayers: PropTypes.number,
};
