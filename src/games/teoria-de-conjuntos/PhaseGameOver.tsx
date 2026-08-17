// Ant Design Resources
import { Divider } from 'antd';
// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useCardWidthByContainerRef } from '@hooks/useCardWidth';
// Components
import { Achievements } from '@components/achievements/Achievements';
import { Translate } from '@components/language/Translate';
import { TitledContainer } from '@components/layout/TitledContainer';
import { GameOverWrapper } from '@components/results/GameOverWrapper';
// Internal
import { achievementsReference } from './utils/achievements';
import type { PhaseGameOverState } from './utils/types';
import { DiagramSection } from './components/DiagramSection';
import { Solution } from './components/Solution';
import { MyThings } from './components/MyThings';
import { GameOverIcon } from './components/Announcement';

export function PhaseGameOver({ state, players, user }: PhaseProps<PhaseGameOverState>) {
  const [width, ref] = useCardWidthByContainerRef(2, { maxWidth: 1000 });

  return (
    <GameOverWrapper
      state={state}
      players={players}
      announcementIcon={
        <GameOverIcon
          items={state.items}
          lastGuess={state.lastGuess}
        />
      }
    >
      <div
        ref={ref}
        style={{ width: '100%' }}
      />
      <Achievements
        players={players}
        achievements={state.achievements}
        reference={achievementsReference}
      />

      <Divider className="my-4" />

      <TitledContainer
        contained
        title={
          <Translate
            pt="As Regras Secretas"
            en="The Secret Rules"
          />
        }
        contentProps={{ orientation: 'vertical' }}
      >
        <Solution solutions={state.solutions} />
      </TitledContainer>

      <DiagramSection
        width={width}
        diagrams={state.diagrams}
        items={state.items}
        solutions={state.solutions}
      >
        <MyThings
          hand={user.hand ?? []}
          items={state.items ?? {}}
          total={state.targetItemsCount}
          maxHeight={width * (state.diagrams?.C ? 1 : 0.7)}
        />
      </DiagramSection>
    </GameOverWrapper>
  );
}
