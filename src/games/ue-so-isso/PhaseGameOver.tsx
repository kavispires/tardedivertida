// Components
import { GameOverWrapper } from 'components/game-over';
import { FlagIcon } from 'components/icons/FlagIcon';

function PhaseGameOver({ state, info }: PhaseProps) {
  return <GameOverWrapper info={info} state={state} announcementIcon={<FlagIcon />} />;
}

export default PhaseGameOver;
