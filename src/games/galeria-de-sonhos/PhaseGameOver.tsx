// Types
import type { PhaseProps } from 'types/game';
// Icons
import { LadderIcon } from 'icons/LadderIcon';
// Components
import { GameOverWrapper } from 'components/game-over';
import { Achievements } from 'components/general/Achievements';
// Internal
import { achievementsReference } from './utils/achievements';
import { BestMatches } from './components/BestMatches';
import { GameOverTable } from './components/GameOverTable';

export function PhaseGameOver({ state, info, players }: PhaseProps) {
  return (
    <GameOverWrapper info={info} state={state} players={players} announcementIcon={<LadderIcon />}>
      <Achievements players={players} achievements={state.achievements} reference={achievementsReference} />
      <BestMatches bestMatches={state.bestMatches} />
      <GameOverTable table={state.table} />
    </GameOverWrapper>
  );
}
