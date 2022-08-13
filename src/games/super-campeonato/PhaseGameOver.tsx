// Components
import { Space } from 'antd';
import { GameOverWrapper } from 'components/game-over';
import { TrophyIcon } from 'components/icons/TrophyIcon';
import { ContenderCard } from './components/ContenderCard';

function PhaseGameOver({ state, info }: PhaseProps) {
  return (
    <GameOverWrapper info={info} state={state} announcementIcon={<TrophyIcon />}>
      <Space className="space-container margin" align="center">
        <ContenderCard size={200} overlayColor="yellow" contender={state.finalWinner} />
      </Space>
    </GameOverWrapper>
  );
}

export default PhaseGameOver;
