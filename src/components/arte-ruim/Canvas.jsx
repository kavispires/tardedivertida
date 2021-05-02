import React, { memo } from 'react';
import { Stage, Layer, Line } from 'react-konva';
import clsx from 'clsx';
import PropTypes from 'prop-types';

const Canvas = ({ drawing = [], className = '' }) => {
  return (
    <Stage width={500} height={500} className={clsx('canvas', className)}>
      <Layer>
        {drawing.map((line, i) => (
          <Line
            key={i}
            points={line}
            stroke="#222222"
            strokeWidth={5}
            tension={0.5}
            lineCap="round"
            globalCompositeOperation="source-over"
          />
        ))}
      </Layer>
    </Stage>
  );
};

Canvas.propTypes = {
  lines: PropTypes.array.isRequired,
  setLines: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export default memo(Canvas);
