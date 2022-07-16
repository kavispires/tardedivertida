// Components
import { GameOverWrapper } from 'components/game-over';
import { LadderIcon } from 'components/icons/LadderIcon';

import { BestMatches } from './components/BestMatches';
import { GameOverTable } from './components/GameOverTable';

function PhaseGameOver({ state, info }: PhaseProps) {
  return (
    <GameOverWrapper info={info} state={state} announcementIcon={<LadderIcon />}>
      <BestMatches bestMatches={state.bestMatches} />

      <GameOverTable table={state.table} />
    </GameOverWrapper>
  );
}

export default PhaseGameOver;
