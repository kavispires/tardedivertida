// Utils
import { achievementsReference } from './utils/achievements';
// Components
import { GameOverWrapper } from 'components/game-over';
import { Achievements } from 'components/general/Achievements';
import { LadderIcon } from 'components/icons/LadderIcon';
import { BestMatches } from './components/BestMatches';
import { GameOverTable } from './components/GameOverTable';

function PhaseGameOver({ state, info, players }: PhaseProps) {
  return (
    <GameOverWrapper info={info} state={state} announcementIcon={<LadderIcon />}>
      <Achievements players={players} achievements={state.achievements} reference={achievementsReference} />
      <BestMatches bestMatches={state.bestMatches} />
      <GameOverTable table={state.table} />
    </GameOverWrapper>
  );
}

export default PhaseGameOver;
