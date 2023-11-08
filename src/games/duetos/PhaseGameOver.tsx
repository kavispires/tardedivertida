// Ant Design Resources
import { Space } from 'antd';
// Utils
import achievementsReference from './utils/achievements';
// Icons
import { TrophyIcon } from 'icons/TrophyIcon';
// Components
import { GameOverWrapper } from 'components/game-over';
import { Achievements } from 'components/general/Achievements';

export function PhaseGameOver({ state, info, players }: PhaseProps) {
  return (
    <GameOverWrapper info={info} state={state} players={players} announcementIcon={<TrophyIcon />}>
      <Achievements players={players} achievements={state.achievements} reference={achievementsReference} />
      <Space className="space-container" wrap>
        {/* Add gallery */}
      </Space>
    </GameOverWrapper>
  );
}
