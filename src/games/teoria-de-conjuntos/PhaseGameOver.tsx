// Ant Design Resources
import { Divider } from 'antd';
// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useCardWidthByContainerRef } from 'hooks/useCardWidth';
import { useUser } from 'hooks/useUser';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
// Components
import { GameOverWrapper } from 'components/game-over';
import { Achievements } from 'components/general/Achievements';
import { Translate } from 'components/language';
import { TitledContainer } from 'components/layout/TitledContainer';
// Internal
import { achievementsReference } from './utils/achievements';
import { DiagramSection } from './components/DiagramSection';
import { Solution } from './components/Solution';
import { MyThings } from './components/MyThings';
import { GameOverIcon } from './components/Announcement';
// import type { MesmiceGalleryEntry } from './utils/types';

export function PhaseGameOver({ state, players }: PhaseProps) {
  const user = useUser(players, state);
  const [, isTheJudge] = useWhichPlayerIsThe('judgeId', state, players);
  const [width, ref] = useCardWidthByContainerRef(2, { maxWidth: 1000 });

  return (
    <GameOverWrapper
      state={state}
      players={players}
      announcementIcon={<GameOverIcon items={state.items} lastGuess={state.lastGuess} />}
    >
      <div ref={ref} style={{ width: '100%' }} />
      <Achievements players={players} achievements={state.achievements} reference={achievementsReference} />

      <Divider />

      <TitledContainer
        contained
        title={<Translate pt="As Regras Secretas" en="The Secret Rules" />}
        contentProps={{ direction: 'vertical' }}
      >
        <Solution solutions={state.solutions} />
      </TitledContainer>

      <DiagramSection width={width} diagrams={state.diagrams} items={state.items} />

      {!isTheJudge && user.hand && (
        <MyThings hand={user.hand ?? []} items={state.items ?? {}} total={state.targetItemsCount} />
      )}
    </GameOverWrapper>
  );
}
