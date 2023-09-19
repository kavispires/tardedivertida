// Icons
import { CrownIcon } from 'icons/CrownIcon';
// Components
import { GameOverWrapper } from 'components/game-over';

export function PhaseGameOver({ state, info, players }: PhaseProps) {
  return (
    <GameOverWrapper
      info={info}
      state={state}
      players={players}
      announcementIcon={<CrownIcon />}
    ></GameOverWrapper>
  );
}
