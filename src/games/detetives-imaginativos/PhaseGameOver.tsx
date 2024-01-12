// Types
import type { PhaseProps } from 'types/game';
// Icons
import { TrophyIcon } from 'icons/TrophyIcon';
// Components
import { GameOverWrapper } from 'components/game-over';

export function PhaseGameOver({ state, info, players }: PhaseProps) {
  return <GameOverWrapper info={info} state={state} players={players} announcementIcon={<TrophyIcon />} />;
}
