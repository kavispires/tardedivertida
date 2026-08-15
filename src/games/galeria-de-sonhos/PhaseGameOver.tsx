// Types
import type { PhaseProps } from 'types/game';
// Icons
import { LadderIcon } from '@icons/LadderIcon';
// Components
import { Achievements } from '@components/achievements/Achievements';
import { GameOverWrapper } from '@components/results/GameOverWrapper';
// Internal
import { achievementsReference } from './utils/achievements';
import type { PhaseGameOverState } from './utils/types';
import { BestMatches } from './components/BestMatches';
import { GameOverTable } from './components/GameOverTable';

export function PhaseGameOver({ state, players }: PhaseProps<PhaseGameOverState>) {
  return (
    <GameOverWrapper
      state={state}
      players={players}
      announcementIcon={<LadderIcon />}
    >
      <Achievements
        players={players}
        achievements={state.achievements}
        reference={achievementsReference}
      />
      <BestMatches bestMatches={state.bestMatches} />
      <GameOverTable table={state.table} />
    </GameOverWrapper>
  );
}
