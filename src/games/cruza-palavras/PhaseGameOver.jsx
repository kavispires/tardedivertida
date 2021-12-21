import PropTypes from 'prop-types';
// Components
import { GameOverWrapper } from '../../components/shared';

function PhaseGameOver({ state, info }) {
  return <GameOverWrapper info={info} state={state} announcementIcon="trophy" />;
}

PhaseGameOver.propTypes = {
  info: PropTypes.object,
  state: PropTypes.object,
};

export default PhaseGameOver;
