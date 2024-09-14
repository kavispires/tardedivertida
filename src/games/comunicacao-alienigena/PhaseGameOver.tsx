// Ant Design Resources
import { Space } from 'antd';
// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
// Icons
import { TrophyIcon } from 'icons/TrophyIcon';
// Components
import { GameOverWrapper } from 'components/game-over';
import { Achievements } from 'components/general/Achievements';
import { ViewIf } from 'components/views';
// Internal
import achievementsReference from './utils/achievements';
import { History } from './components/History';
import { HumanSignBoard } from './components/HumanSignBoard';
import { ObjectsGrid } from './components/ObjectsGrid';
import { SignsKeyCard } from './components/SignsKeyCard';

export function PhaseGameOver({ state, info, players }: PhaseProps) {
  const [, isUserAlien] = useWhichPlayerIsThe('alienId', state, players);
  return (
    <GameOverWrapper info={info} state={state} players={players} announcementIcon={<TrophyIcon />}>
      <Achievements players={players} achievements={state.achievements} reference={achievementsReference} />

      <ViewIf condition={state.items && state.signs && state.inquiryHistory && state.requestHistory}>
        <Space className="space-container" wrap>
          <ObjectsGrid items={state.items} showTypes showAll status={state.status} />
          <Space className="space-container" wrap direction="vertical">
            <SignsKeyCard signs={state.signs} />
            <ViewIf condition={!isUserAlien}>
              <HumanSignBoard signs={state.signs} startingAttributes={state.startingAttributes} />
            </ViewIf>
          </Space>
        </Space>

        <History
          inquiryHistory={state.inquiryHistory}
          requestHistory={state.requestHistory}
          players={players}
          items={state.items}
          isAlienBot={state.isAlienBot}
          showIntention
          debugMode={!!state.debugMode}
          signs={state.signs}
        />
      </ViewIf>
    </GameOverWrapper>
  );
}
