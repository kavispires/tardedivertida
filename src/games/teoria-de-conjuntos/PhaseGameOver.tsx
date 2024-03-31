// Types
import type { PhaseProps } from 'types/game';
// import type { MesmiceGalleryEntry } from './utils/types';
// Utils
import { achievementsReference } from './utils/achievements';
// Icons
import { CrownIcon } from 'icons/CrownIcon';
// Components
import { GameOverWrapper } from 'components/game-over';
import { Achievements } from 'components/general/Achievements';
import { Container } from 'components/general/Container';
import { Translate } from 'components/language';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
import { DiagramSection } from './components/DiagramSection';
import { useCardWidthByContainerRef } from 'hooks/useCardWidth';
import { Solution } from './components/Solution';
import { MyThings } from './components/MyThings';
import { useUser } from 'hooks/useUser';

export function PhaseGameOver({ state, info, players }: PhaseProps) {
  const user = useUser(players, state);
  const [, isTheJudge] = useWhichPlayerIsThe('judgeId', state, players);
  const [width, ref] = useCardWidthByContainerRef(2, { maxWidth: 1000 });

  return (
    <GameOverWrapper info={info} state={state} players={players} announcementIcon={<CrownIcon />}>
      <div ref={ref} style={{ width: '100%' }} />
      <Achievements players={players} achievements={state.achievements} reference={achievementsReference} />

      <DiagramSection width={width} diagrams={state.diagrams} items={state.items} />

      <Container
        contained
        title={<Translate pt="As Regras Secretas" en="The Secret Rules" />}
        contentProps={{ direction: 'vertical' }}
      >
        <Solution solutions={state.solutions} />
      </Container>

      {!isTheJudge && user.hand && <MyThings hand={user.hand ?? []} items={state.items ?? {}} />}
    </GameOverWrapper>
  );
}
