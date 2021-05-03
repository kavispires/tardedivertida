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

function CanvasSVG({ drawing = '', className = '' }) {
  const konvaLines = JSON.parse(drawing);
  const paths = getPathFromKonvaLines(konvaLines);

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" overflow="hidden" className={className}>
      <defs />
      {paths.map((path) => (
        <path
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
  drawing: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export default memo(CanvasSVG);
