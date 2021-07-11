import PropTypes from 'prop-types';
import React, { memo, useEffect } from 'react';
// Design Resources
import { Slider } from 'antd';
// State & Hooks
import { useDimensions, useGlobalState } from '../../../hooks';

const CanvasResizer = ({ numPlayers = 5 }) => {
  const [canvasSize, setCanvasSize] = useGlobalState('canvasSize');
  const [cachedCanvasSize] = useGlobalState('cachedCanvasSize');
  const [width] = useDimensions();

  useEffect(() => {
    if (canvasSize === 250 || canvasSize !== cachedCanvasSize) {
      setCanvasSize(Math.round(width / numPlayers) - 30);
    }
  }, [width]); // eslint-disable-line

  return (
    <div className="a-canvas-resizer">
      <div className="a-canvas-resizer__label">Tamanho das Images</div>
      <Slider
        className="a-canvas-resizer__slider"
        defaultValue={canvasSize}
        min={100}
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

export default memo(CanvasResizer);
