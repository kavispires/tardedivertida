// Components
import { GameOverWrapper } from 'components/game-over';
import { TrophyIcon } from 'components/icons/TrophyIcon';

function PhaseGameOver({ state, info }: PhaseProps) {
  return <GameOverWrapper info={info} state={state} announcementIcon={<TrophyIcon />} />;
}

export default PhaseGameOver;
