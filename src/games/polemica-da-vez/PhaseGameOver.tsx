// Components
import { GameOverWrapper } from 'components';

function PhaseGameOver({ state, info }: PhaseProps) {
  return <GameOverWrapper announcementIcon="trophy" info={info} state={state} />;
}

export default PhaseGameOver;
