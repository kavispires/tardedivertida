import React, { memo } from 'react';
import { Stage, Layer, Line } from 'react-konva';
import clsx from 'clsx';
import PropTypes from 'prop-types';

const Canvas = ({ drawing = '[]', className = '' }) => {
  const lines = typeof drawing === 'string' ? JSON.parse(drawing) : drawing;

  return (
    <Stage width={500} height={500} className={clsx('canvas', className)}>
      <Layer>
        {lines.map((line, i) => (
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
  className: PropTypes.string,
  drawing: PropTypes.oneOfType([PropTypes.array, PropTypes.string]).isRequired,
};

export default memo(Canvas);
