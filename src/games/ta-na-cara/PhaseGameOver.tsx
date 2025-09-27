// Types
import type { PhaseProps } from 'types/game';
import type { GamePlayer } from 'types/player';
// Icons
import { FlagIcon } from 'icons/FlagIcon';
// Components
import { GameOverWrapper } from 'components/game-over';
import { SpaceContainer } from 'components/layout/SpaceContainer';
// Internal

export function PhaseGameOver({ state, players }: PhaseProps) {
  return <GameOverWrapper state={state} players={players} announcementIcon={<FlagIcon />}></GameOverWrapper>;
}

export default PhaseGameOver;
