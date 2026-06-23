import { orderBy } from 'lodash';
import { useMemo } from 'react';
// Types
import type { PhaseProps } from 'types/game';
// Icons
import { TrophyIcon } from '@icons/TrophyIcon';
// Components
import { GameOverWrapper } from '@components/game-over/GameOverWrapper';
import { Achievements } from '@components/general/Achievements';
import { SpaceContainer } from '@components/layout/SpaceContainer';
import { PlayersTabs } from '@components/players/PlayersTabs';
import { ViewIf } from '@components/views/ViewIf';
// Internal
import achievementsReference from './utils/achievements';
import type { PhaseGameOverState } from './utils/types';
import { History } from './components/History';
import { HumanPlayerFinalSignBoard } from './components/HumanSignBoard';
import { ObjectsGrid } from './components/ObjectsGrid';
import { SignsKeyCard } from './components/SignsKeyCard';

export function PhaseGameOver({ state, players, user }: PhaseProps<PhaseGameOverState>) {
  const tabsContent = useMemo(() => {
    return orderBy(
      Object.values(players).filter((player) => player.role === 'human'),
      ['name'],
      ['asc'],
    ).map((player) => ({
      player,
      content: (
        <HumanPlayerFinalSignBoard
          attributes={state.attributes}
          startingAttributesIds={state.startingAttributesIds}
          player={player}
        />
      ),
    }));
  }, [state, players]);

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

      <ViewIf condition={!!(state.items && state.attributes && state.inquiryHistory && state.requestHistory)}>
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
              inquiryHistory={state.inquiryHistory}
            />
            <PlayersTabs
              list={tabsContent}
              user={user}
            />
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
