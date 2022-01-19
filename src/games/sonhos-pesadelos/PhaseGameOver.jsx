// Components
import { GameOverWrapper } from '../../components';

function PhaseGameOver({ state, players, info }) {
  return <GameOverWrapper info={info} state={state} announcementIcon="trophy" />;
}

export default PhaseGameOver;
