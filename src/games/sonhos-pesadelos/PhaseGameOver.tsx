// Components
import { GameOverWrapper } from 'components/game-over';

function PhaseGameOver({ state, info }: PhaseProps) {
  return <GameOverWrapper info={info} state={state} announcementIcon="trophy" />;
}

export default PhaseGameOver;