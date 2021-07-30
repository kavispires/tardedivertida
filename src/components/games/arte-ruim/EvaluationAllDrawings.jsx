import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
// Components
import { CanvasSVG } from '../../canvas';
import Ribbon from './Ribbon';

function EvaluationAllDrawings({ drawings, activeItem, onActivateItem, votes, canvasSize, players }) {
  const liButtonBaseClass = 'a-evaluation-all-drawings__li-drawing-button';

  return (
    <ul className="a-evaluation-all-drawings">
      {drawings?.map((drawingEntry) => {
        const canvasEntryId = `drawing::${drawingEntry.id}`;
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
            <span className="a-evaluation-all-drawings__artist">{players[drawingEntry.playerId].name}</span>
          </li>
        );
      })}
    </ul>
  );
}

EvaluationAllDrawings.propTypes = {
  activeItem: PropTypes.string,
  canvasSize: PropTypes.number,
  drawings: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      drawing: PropTypes.string,
      playerId: PropTypes.string,
    })
  ),
  onActivateItem: PropTypes.func,
  onActiveItem: PropTypes.func,
  votes: PropTypes.object,
  players: PropTypes.object,
};

export default EvaluationAllDrawings;
