// Types
import type { PhaseProps } from 'types/game';
// Icons
import { TrophyIcon } from 'icons/TrophyIcon';
// Components
import { GameOverWrapper } from 'components/game-over';
import { Translate } from 'components/language';
import { Container } from 'components/layout/Container';
// Internal
import type { PhaseGameOverState } from './utils/types';
// Ant Design Resources
// import { Achievements } from 'components/general/Achievements';
// import achievementsReference from './utils/achievements';

export function PhaseGameOver({ state, players }: PhaseProps<PhaseGameOverState>) {
  return (
    <GameOverWrapper state={state} players={players} announcementIcon={<TrophyIcon />}>
      {/* <Achievements players={players} achievements={state.achievements} reference={achievementsReference} /> */}
      <Container title={<Translate pt="Dicionário" en="Dictionary" />} className="mt-4">
        TBD
      </Container>
    </GameOverWrapper>
  );
}
