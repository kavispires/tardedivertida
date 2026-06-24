// Types
import type { PhaseProps } from 'types/game';
// Icons
import { TrophyIcon } from '@icons/TrophyIcon';
// Components
import { GameOverWrapper } from '@components/wrappers/GameOverWrapper';

export function PhaseGameOver({ state, players }: PhaseProps) {
  return (
    <GameOverWrapper
      state={state}
      players={players}
      announcementIcon={<TrophyIcon />}
    />
  );
}
