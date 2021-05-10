import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
// Components
import CanvasSVG from './CanvasSVG';
import Ribbon from './Ribbon';

function EvaluationAllDrawings({ drawings, activeItem, onActivateItem, votes, canvasSize }) {
  const liButtonBaseClass = 'a-evaluation-all-drawings__li-drawing-button';

  return (
    <ul className="a-evaluation-all-drawings">
      {drawings?.map((drawingEntry) => {
        const canvasEntryId = `drawing-${drawingEntry.id}`;
        const isActive = activeItem === canvasEntryId;
        return (
          <li
            key={canvasEntryId}
            className={clsx(liButtonBaseClass, isActive && `${liButtonBaseClass}--active`)}
            onClick={() => onActivateItem(canvasEntryId)}
          >
            {votes?.[canvasEntryId] && <Ribbon cardEntryId={votes[canvasEntryId]} />}
            <CanvasSVG
              drawing={drawingEntry.drawing}
              className="a-evaluation-all-drawings__drawing"
              size={canvasSize}
            />
          </li>
        );
      })}
    </ul>
  );
}

EvaluationAllDrawings.propTypes = {
  activeItem: PropTypes.string,
  drawings: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      drawing: PropTypes.string,
    })
  ),
  onActiveItem: PropTypes.func,
  votes: PropTypes.object,
  canvasSize: PropTypes.number,
};

export default EvaluationAllDrawings;
