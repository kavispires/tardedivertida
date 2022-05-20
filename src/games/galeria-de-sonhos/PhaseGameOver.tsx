// Components
import { GameOverWrapper } from 'components/game-over';

import { BestMatches } from './components/BestMatches';

function PhaseGameOver({ state, info }: PhaseProps) {
  return (
    <GameOverWrapper info={info} state={state} announcementIcon="ladder">
      <BestMatches bestMatches={state.bestMatches} />
    </GameOverWrapper>
  );
}

export default PhaseGameOver;
