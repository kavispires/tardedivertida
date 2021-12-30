import PropTypes from 'prop-types';
// Components
import { GameOverWrapper } from '../../components/shared';

function PhaseGameOver({ state, info }) {
  return <GameOverWrapper announcementIcon="trophy" info={info} state={state} />;
}

PhaseGameOver.propTypes = {
  info: PropTypes.object,
  state: PropTypes.object,
};

export default PhaseGameOver;
