// Types
import type { PhaseProps } from 'types/game';
// Icons
import { TrophyIcon } from 'icons/TrophyIcon';
// Components
import { GameOverWrapper } from 'components/game-over';
import { Achievements } from 'components/general/Achievements';
import { SpaceContainer } from 'components/layout/SpaceContainer';
// Internal
import achievementsReference from './utils/achievements';
import { FinalOutcome } from './components/FinalOutcome';

export function PhaseGameOver({ state, players }: PhaseProps) {
  return (
    <GameOverWrapper state={state} players={players} announcementIcon={<TrophyIcon />}>
      <FinalOutcome players={players} outcome={state.outcome} robot={state.robot} />
      <Achievements players={players} achievements={state.achievements} reference={achievementsReference} />

      <SpaceContainer wrap>{/* Add gallery */}</SpaceContainer>
    </GameOverWrapper>
  );
}
