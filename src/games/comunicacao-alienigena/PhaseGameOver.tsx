// Components
import { Space } from 'antd';
import { GameOverWrapper } from 'components/game-over';
import { TrophyIcon } from 'components/icons/TrophyIcon';
import { ObjectsGrid } from './components/ObjectsGrid';
import { SignsKeyCard } from './components/SignsKeyCard';

function PhaseGameOver({ state, info }: PhaseProps) {
  return (
    <GameOverWrapper info={info} state={state} announcementIcon={<TrophyIcon />}>
      <Space className="space-container" wrap>
        <ObjectsGrid items={state.items} showTypes />
        <SignsKeyCard signs={state.signs} />
      </Space>
    </GameOverWrapper>
  );
}

export default PhaseGameOver;
