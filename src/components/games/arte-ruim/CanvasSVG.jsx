import React, { memo } from 'react';
import PropTypes from 'prop-types';

const getPathFromKonvaLines = (lines) => {
  const result = lines.map((lineArr) => {
    let path = '';
    for (let x = 0, y = 1; y < lineArr.length; x += 2, y += 2) {
      if (lineArr[x + 2] && lineArr[y + 2]) {
        path += `M${lineArr[x]},${lineArr[y]} L${lineArr[x + 2]},${lineArr[y + 2]}`;
      }
    }

    return path;
  });

  return result;
};

function CanvasSVG({ drawing = '', className = '', size = 250 }) {
  const konvaLines = JSON.parse(drawing);
  const paths = getPathFromKonvaLines(konvaLines);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 500 500"
      overflow="hidden"
      className={className}
      style={{ width: `${size}px` }}
    >
      <defs />
      {paths.map((path, index) => (
        <path
          key={`${drawing}-${index}`}
          d={path}
          fill="none"
          stroke="#000"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit="10"
        />
      ))}
    </svg>
  );
}

CanvasSVG.propTypes = {
  className: PropTypes.string,
  drawing: PropTypes.string.isRequired,
  size: PropTypes.number,
};

CanvasSVG.defaultProps = {
  size: 250,
};

export default memo(CanvasSVG);
