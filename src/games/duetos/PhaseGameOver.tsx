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

export function PhaseGameOver({ state, players }: PhaseProps) {
  return (
    <GameOverWrapper state={state} players={players} announcementIcon={<TrophyIcon />}>
      <Achievements players={players} achievements={state.achievements} reference={achievementsReference} />
      <SpaceContainer wrap>
        {/* Add gallery */}
        <div></div>
      </SpaceContainer>
    </GameOverWrapper>
  );
}
