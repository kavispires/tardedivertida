import React from 'react';
import PropTypes from 'prop-types';
// Components
import { GameOverWrapper } from '../../components/shared';

function PhaseGameOver({ state, info }) {
  return <GameOverWrapper announcementIcon="trophy" info={info} state={state} />;
}

PhaseGameOver.propTypes = {
  info: PropTypes.any,
  state: PropTypes.shape({
    winners: PropTypes.array,
    losers: PropTypes.array,
    phase: PropTypes.string,
    round: PropTypes.shape({
      current: PropTypes.number,
      total: PropTypes.number,
    }),
  }),
};

export default PhaseGameOver;
