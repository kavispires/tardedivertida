// Types
import type { PhaseProps } from 'types/game';
// Ant Design Resources
import { Space } from 'antd';
// Hooks
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
// Icons
import { TrophyIcon } from 'icons/TrophyIcon';
// Utils
import achievementsReference from './utils/achievements';
// Components
import { GameOverWrapper } from 'components/game-over';
import { ViewIf } from 'components/views';
import { History } from './components/History';
import { HumanSignBoard } from './components/HumanSignBoard';
import { ObjectsGrid } from './components/ObjectsGrid';
import { SignsKeyCard } from './components/SignsKeyCard';
import { Achievements } from 'components/general/Achievements';

export function PhaseGameOver({ state, info, players }: PhaseProps) {
  const [, isUserAlien] = useWhichPlayerIsThe('alienId', state, players);
  return (
    <GameOverWrapper info={info} state={state} players={players} announcementIcon={<TrophyIcon />}>
      <Achievements players={players} achievements={state.achievements} reference={achievementsReference} />

      <ViewIf condition={state.items && state.signs && state.inquiryHistory && state.requestHistory}>
        <Space className="space-container" wrap>
          <ObjectsGrid items={state.items} showTypes showAll />
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
