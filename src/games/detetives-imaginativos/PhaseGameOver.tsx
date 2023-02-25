// Icons
import { TrophyIcon } from 'icons/TrophyIcon';
// Components
import { GameOverWrapper } from 'components/game-over';

function PhaseGameOver({ state, info }: PhaseProps) {
  return <GameOverWrapper info={info} state={state} announcementIcon={<TrophyIcon />} />;
}

export default PhaseGameOver;
