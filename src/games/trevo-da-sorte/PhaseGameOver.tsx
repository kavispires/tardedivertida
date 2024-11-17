// Types
import { PhaseProps } from 'types/game';
// Icons
import { TrophyIcon } from 'icons/TrophyIcon';
// Components
import { GameOverWrapper } from 'components/game-over';

export function PhaseGameOver({ state, players }: PhaseProps) {
  return <GameOverWrapper state={state} players={players} announcementIcon={<TrophyIcon />} />;
}
