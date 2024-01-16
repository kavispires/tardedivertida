// Types
import type { PhaseProps } from 'types/game';
// Icons
import { CrownIcon } from 'icons/CrownIcon';
// Components
import { GameOverWrapper } from 'components/game-over';
// import { achievementsReference } from './utils/achievements';
// import { Achievements } from 'components/general/Achievements';

export function PhaseGameOver({ state, info, players }: PhaseProps) {
  return (
    <GameOverWrapper info={info} state={state} players={players} announcementIcon={<CrownIcon />}>
      {/* <Achievements players={players} achievements={state.achievements} reference={achievementsReference} /> */}
    </GameOverWrapper>
  );
}
