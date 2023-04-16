// Icons
import { FlagIcon } from 'icons/FlagIcon';
// Components
import { GameOverWrapper } from 'components/game-over';

function PhaseGameOver({ state, info, players }: PhaseProps) {
  return <GameOverWrapper info={info} state={state} players={players} announcementIcon={<FlagIcon />} />;
}

export default PhaseGameOver;
