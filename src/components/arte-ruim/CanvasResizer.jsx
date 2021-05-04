import React, { memo } from 'react';
// Design Resources
import { Slider } from 'antd';
// State & Hooks
import { useGlobalState } from '../../hooks';

const CanvasResizer = () => {
  const [canvasSize, setCanvasSize] = useGlobalState('canvasSize');

  return (
    <div className="canvas-resizer">
      <div className="canvas-resizer__label">Tamanho das Images</div>
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

export default memo(CanvasResizer);
