import React, { useRef } from 'react';
import { Stage, Layer, Line } from 'react-konva';
import clsx from 'clsx';
import PropTypes from 'prop-types';

const DrawingCanvas = ({ lines, setLines, className = '' }) => {
  const isDrawing = useRef(false);

  const handleMouseDown = (e) => {
    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    setLines([...lines, [pos.x, pos.y]]);
  };

  const handleMouseMove = (e) => {
    // no drawing - skipping
    if (!isDrawing.current) {
      return;
    }
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    let lastLine = lines[lines.length - 1];
    // add point
    lastLine = lastLine.concat([point.x, point.y]);

    // replace last
    lines.splice(lines.length - 1, 1, lastLine);
    setLines(lines.concat());
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  return (
    <Stage
      width={500}
      height={500}
      onMouseDown={handleMouseDown}
      onMousemove={handleMouseMove}
      onMouseup={handleMouseUp}
      className={clsx('a-drawing-canvas', className)}
    >
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

DrawingCanvas.propTypes = {
  lines: PropTypes.array.isRequired,
  setLines: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export default DrawingCanvas;
