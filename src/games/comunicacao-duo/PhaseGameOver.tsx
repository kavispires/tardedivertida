// Ant Design Resources
import { Space } from 'antd';
// Types
import type { PhaseProps } from 'types/game';
// Icons
import { TheEndIcon } from 'icons/TheEndIcon';
// Components
import { GameOverWrapper } from 'components/game-over';
// Icons
// import { Achievements } from 'components/general/Achievements';
// Internal
// import achievementsReference from './utils/achievements';

export function PhaseGameOver({ state, players }: PhaseProps) {
  return (
    <GameOverWrapper state={state} players={players} announcementIcon={<TheEndIcon />}>
      {/* <Achievements players={players} achievements={state.achievements} reference={achievementsReference} /> */}
      <Space className="space-container" wrap>
        {/* Add gallery */}
      </Space>
    </GameOverWrapper>
  );
}
