// Icons
import { FlagIcon } from 'icons/FlagIcon';
// Components
import { GameOverWrapper } from 'components/game-over';
import { Space } from 'antd';

export function PhaseGameOver({ state, info, players }: PhaseProps) {
  return (
    <GameOverWrapper info={info} state={state} players={players} announcementIcon={<FlagIcon />}>
      <Space className="space-container" wrap>
        TODO: Add player paths
      </Space>
    </GameOverWrapper>
  );
}
