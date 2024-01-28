import { useMemo } from 'react';
import { orderBy } from 'lodash';
// Types
import type { PhaseProps } from 'types/game';
import type { Crime } from './utils/types';
// Hooks
import { useUser } from 'hooks/useUser';
// Utils
import achievementsReference from './utils/achievements';
// Icons
import { TrophyIcon } from 'icons/TrophyIcon';
// Components
import { GameOverWrapper } from 'components/game-over';
import { CrimeSummary } from './components/CrimeSummary';
import { Achievements } from 'components/general/Achievements';

export function PhaseGameOver({ state, players, info }: PhaseProps) {
  const crimes: Crime[] = useMemo(() => orderBy(state.crimes ?? [], ['playerId']), [state.crimes]);
  const user = useUser(players, state);

  return (
    <GameOverWrapper info={info} state={state} players={players} announcementIcon={<TrophyIcon />}>
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
