// Components
import { GameOverWrapper } from 'components/game-over';

import { BestMatches } from './components/BestMatches';
import { GameOverTable } from './components/GameOverTable';

function PhaseGameOver({ state, info }: PhaseProps) {
  return (
    <GameOverWrapper info={info} state={state} announcementIcon="ladder">
      <BestMatches bestMatches={state.bestMatches} />

      <GameOverTable table={state.table} />
    </GameOverWrapper>
  );
}

export default PhaseGameOver;
