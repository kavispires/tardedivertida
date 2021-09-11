import PropTypes from 'prop-types';
import React from 'react';
// Components
import { GameOverWrapper } from '../../components/shared';

function PhaseGameOver({ state, players, info }) {
  return <GameOverWrapper info={info} state={state} announcementIcon="trophy" />;
}

PhaseGameOver.propTypes = {
  info: PropTypes.object,
  players: PropTypes.object,
  state: PropTypes.object,
};

export default PhaseGameOver;
