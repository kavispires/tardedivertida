// Ant Design resources
import { Space } from 'antd';
// Icons
import { TrophyIcon } from 'icons/TrophyIcon';
// Components
import { GameOverWrapper } from 'components/game-over';
import { Translate } from 'components/language';
import { Title } from 'components/text';
import { ContenderCard } from './components/ContenderCard';

function PhaseGameOver({ state, info }: PhaseProps) {
  return (
    <GameOverWrapper info={info} state={state} announcementIcon={<TrophyIcon />}>
      <Title size="xx-small" className="padding">
        <Translate pt="Campeão Ultimate" en="Ultimate Champion" />
      </Title>

      <Space className="space-container margin" align="center">
        <ContenderCard size={200} overlayColor="yellow" contender={state.finalWinner} />
      </Space>
    </GameOverWrapper>
  );
}

export default PhaseGameOver;
