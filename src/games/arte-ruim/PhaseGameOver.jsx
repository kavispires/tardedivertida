import PropTypes from 'prop-types';
import React from 'react';
// Components
import { GameOverWrapper, Translate } from '../../components/shared';
import { CanvasSVG } from '../../components/canvas';
import DrawingGrade from './DrawingGrade';

function PhaseGameOver({ state, players, info }) {
  return (
    <GameOverWrapper info={info} state={state} announcementIcon="trophy">
      <ul className="a-game-over__gallery">
        {state.drawings.map((entry) => {
          return (
            <li className="a-game-over__gallery-item" key={entry.drawing} style={{ width: '200px' }}>
              <CanvasSVG drawing={entry.drawing} size={200} className="a-game-over__gallery-canvas" />
              <span className="a-game-over__credits">
                "{entry.text}" <Translate pt="por" en="by" /> {players[entry.playerId].name}
              </span>
              <DrawingGrade value={entry.successRate} />
            </li>
          );
        })}
      </ul>
    </GameOverWrapper>
  );
}

PhaseGameOver.propTypes = {
  info: PropTypes.object,
  players: PropTypes.object,
  state: PropTypes.shape({
    drawings: PropTypes.array,
  }),
};

export default PhaseGameOver;
