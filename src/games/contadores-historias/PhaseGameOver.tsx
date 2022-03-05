// Components
import { GameOverWrapper } from 'components';

function PhaseGameOver({ state, info }: PhaseProps) {
  return <GameOverWrapper info={info} state={state} announcementIcon="trophy" />;
}

export default PhaseGameOver;
