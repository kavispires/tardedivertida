import { orderBy } from 'lodash';
import { useMemo } from 'react';
// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useUser } from 'hooks/useUser';
// Icons
import { TrophyIcon } from 'icons/TrophyIcon';
// Components
import { GameOverWrapper } from 'components/game-over';
import { Achievements } from 'components/general/Achievements';
// Internal
import type { Crime, PhaseGameOverState } from './utils/types';
import achievementsReference from './utils/achievements';
import { CrimeSummary } from './components/CrimeSummary';

export function PhaseGameOver({ state, players }: PhaseProps<PhaseGameOverState>) {
  const crimes: Crime[] = useMemo(() => orderBy(state.crimes ?? [], ['playerId']), [state.crimes]);
  const user = useUser(players, state);

  return (
    <GameOverWrapper state={state} players={players} announcementIcon={<TrophyIcon />}>
      <Achievements players={players} achievements={state.achievements} reference={achievementsReference} />

      <ul>
        {crimes.map((crime) => (
          <CrimeSummary
            key={`crime-by-${crime.playerId}`}
            crime={crime}
            items={state.items}
            player={players[crime.playerId]}
            scenes={state.scenes}
            scenesOrder={state.scenesOrder}
            selectedEvidenceId={crime.evidenceId}
            selectedWeaponId={crime.weaponId}
            history={user.history?.[crime.playerId]}
          />
        ))}
      </ul>
    </GameOverWrapper>
  );
}
