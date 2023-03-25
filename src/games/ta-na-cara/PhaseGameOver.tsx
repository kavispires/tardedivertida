// Icons
import { FlagIcon } from 'icons/FlagIcon';
// Components
import { GameOverWrapper } from 'components/game-over';

function PhaseGameOver({ state, info }: PhaseProps) {
  return <GameOverWrapper info={info} state={state} announcementIcon={<FlagIcon />} />;
}

export default PhaseGameOver;
