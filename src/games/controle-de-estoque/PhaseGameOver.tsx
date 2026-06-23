// Types
import type { PhaseProps } from 'types/game';
// Icons
import { TrophyIcon } from '@icons/TrophyIcon';
// Components
import { GameOverWrapper } from '@components/game-over/GameOverWrapper';
import { Achievements } from '@components/general/Achievements';
// Internal
import type { PhaseGameOverState } from './utils/types';
import { useWarehouse } from './utils/hooks';
import { achievementsReference } from './utils/achievements';
import { Warehouse } from './components/Warehouse';

export function PhaseGameOver({ state, players }: PhaseProps<PhaseGameOverState>) {
  const warehouse = useWarehouse(state.warehouseGrid);
  return (
    <GameOverWrapper
      state={state}
      players={players}
      announcementIcon={<TrophyIcon />}
    >
      <Achievements
        players={players}
        achievements={state.achievements}
        reference={achievementsReference}
      />

      <Warehouse
        goodsDict={state.goodsDict}
        warehouse={warehouse}
      />
    </GameOverWrapper>
  );
}
