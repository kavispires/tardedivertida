// Types
import type { PhaseProps } from 'types/game';
// Icons
import { BadgeIcon } from 'icons/BadgeIcon';
import { NoIcon } from 'icons/NoIcon';
import { NuclearExplosionIcon } from 'icons/NuclearExplosionIcon';
import { TrophyIcon } from 'icons/TrophyIcon';
// Components
import { GameOverWrapper } from 'components/game-over';
import { Achievements } from 'components/general/Achievements';
// Internal
import achievementsReference from './utils/achievements';
import { OUTCOME } from './utils/constants';
import { FinalOutcome } from './components/FinalOutcome';
import { GameOverGallery } from './components/GameOverGallery';

export function PhaseGameOver({ state, players }: PhaseProps) {
  const announcementIcon = {
    [OUTCOME.HUMANS_WIN]: <TrophyIcon />,
    [OUTCOME.ROBOT_WINS]: <NuclearExplosionIcon />,
    [OUTCOME.TOO_SUSPICIOUS]: <NoIcon />,
  }?.[state.outcome as string] ?? <BadgeIcon />;

  return (
    <GameOverWrapper state={state} players={players} announcementIcon={announcementIcon}>
      <FinalOutcome players={players} outcome={state.outcome} robot={state.robot} />
      <Achievements players={players} achievements={state.achievements} reference={achievementsReference} />

      <GameOverGallery gallery={state.gallery} players={players} />
    </GameOverWrapper>
  );
}
