import PropTypes from 'prop-types';
import React from 'react';
// Components
import { GameOver } from '../../shared';
import { CanvasSVG } from '../../canvas';
import DrawingGrade from './DrawingGrade';

function GameOverPhase({ state, players, info }) {
  return (
    <GameOver info={info} state={state}>
      <ul className="a-game-over__gallery">
        {state.drawings.map((entry) => {
          return (
            <li className="a-game-over__gallery-item" key={entry.drawing}>
              <CanvasSVG drawing={entry.drawing} size={200} className="a-game-over__gallery-canvas" />
              <span className="a-game-over__credits">
                "{entry.text}" por {players[entry.playerId].name}
              </span>
              <DrawingGrade value={entry.successRate} />
            </li>
          );
        })}
      </ul>
    </GameOver>
  );
}

GameOverPhase.propTypes = {
  info: PropTypes.object,
  state: PropTypes.shape({
    drawings: PropTypes.array,
  }),
  players: PropTypes.object,
};

export default GameOverPhase;
