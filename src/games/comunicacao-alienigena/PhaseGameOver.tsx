// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
// Icons
import { TrophyIcon } from 'icons/TrophyIcon';
// Components
import { GameOverWrapper } from 'components/game-over';
import { Achievements } from 'components/general/Achievements';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { ViewIf } from 'components/views';
// Internal
import achievementsReference from './utils/achievements';
import { History } from './components/History';
import { HumanSignBoard } from './components/HumanSignBoard';
import { ObjectsGrid } from './components/ObjectsGrid';
import { SignsKeyCard } from './components/SignsKeyCard';

export function PhaseGameOver({ state, players }: PhaseProps) {
  const [, isUserAlien] = useWhichPlayerIsThe('alienId', state, players);
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

      <ViewIf condition={state.items && state.attributes && state.inquiryHistory && state.requestHistory}>
        <SpaceContainer wrap>
          <ObjectsGrid
            items={state.items}
            showTypes
            showAll
            status={state.status}
          />
          <SpaceContainer
            wrap
            vertical
          >
            <SignsKeyCard
              attributes={state.attributes}
              startingAttributesIds={state.startingAttributesIds}
            />
            <ViewIf condition={!isUserAlien}>
              <HumanSignBoard
                attributes={state.attributes}
                startingAttributesIds={state.startingAttributesIds}
              />
            </ViewIf>
          </SpaceContainer>
        </SpaceContainer>

        <History
          inquiryHistory={state.inquiryHistory}
          requestHistory={state.requestHistory}
          players={players}
          items={state.items}
          isAlienBot={state.alienBot}
          showIntention
          debugMode={!!state.debugMode}
          attributes={state.attributes}
        />
      </ViewIf>
    </GameOverWrapper>
  );
}
