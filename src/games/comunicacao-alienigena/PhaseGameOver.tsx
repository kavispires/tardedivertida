// Components
import { Space } from 'antd';
import { GameOverWrapper } from 'components/game-over';
import { TrophyIcon } from 'components/icons/TrophyIcon';
import { ViewIf } from 'components/views';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
import { History } from './components/History';
import { HumanSignBoard } from './components/HumanSignBoard';
import { ObjectsGrid } from './components/ObjectsGrid';
import { SignsKeyCard } from './components/SignsKeyCard';

function PhaseGameOver({ state, info, players }: PhaseProps) {
  const [, isUserAlien] = useWhichPlayerIsThe('alienId', state, players);
  return (
    <GameOverWrapper info={info} state={state} announcementIcon={<TrophyIcon />}>
      <Space className="space-container" wrap>
        <ObjectsGrid items={state.items} showTypes showAll />
        <Space className="space-container" wrap direction="vertical">
          <SignsKeyCard signs={state.signs} />
          <ViewIf condition={!isUserAlien}>
            <HumanSignBoard signs={state.signs} />
          </ViewIf>
        </Space>
      </Space>

      <History
        inquiryHistory={state.inquiryHistory}
        requestHistory={state.requestHistory}
        players={players}
        items={state.items}
      />
    </GameOverWrapper>
  );
}

export default PhaseGameOver;
