// Icons
import { TrophyIcon } from 'icons/TrophyIcon';
// Components
import { GameOverWrapper } from 'components/game-over';

function PhaseGameOver({ state, info, players }: PhaseProps) {
  return <GameOverWrapper info={info} state={state} players={players} announcementIcon={<TrophyIcon />} />;
}

export default PhaseGameOver;