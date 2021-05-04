import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
// Components
import CanvasSVG from './CanvasSVG';
import Ribbon from './Ribbon';

function EvaluationAllDrawings({ drawings, activeItem, onActivateItem, votes, canvasSize }) {
  return (
    <ul className="evaluation-phase__all-drawings">
      {drawings?.map((drawingEntry) => {
        const canvasEntryId = `drawing-${drawingEntry.cardId}`;
        return (
          <li
            key={canvasEntryId}
            className={clsx(
              'evaluation-phase__li-drawing-button',
              activeItem === canvasEntryId && 'evaluation-phase__li-drawing-button--active'
            )}
            onClick={() => onActivateItem(canvasEntryId)}
          >
            {votes?.[canvasEntryId] && <Ribbon cardEntryId={votes[canvasEntryId]} />}
            <CanvasSVG
              drawing={drawingEntry.drawing}
              className="evaluation-phase__drawing"
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
      cardId: PropTypes.string,
      drawing: PropTypes.string,
    })
  ),
  onActiveItem: PropTypes.func,
  votes: PropTypes.object,
  canvasSize: PropTypes.number,
};

export default EvaluationAllDrawings;
