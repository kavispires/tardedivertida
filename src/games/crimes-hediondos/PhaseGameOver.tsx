import { orderBy } from 'lodash';
import { useMemo } from 'react';
// Types
import type { PhaseProps } from 'types/game';
// Icons
import { TrophyIcon } from 'icons/TrophyIcon';
// Components
import { GameOverWrapper } from 'components/game-over';
import { Achievements } from 'components/general/Achievements';
// Internal
import type { Crime, PhaseGameOverState } from './utils/types';
import achievementsReference from './utils/achievements';
import { useGameTypes } from './utils/useGameTypes';
import { CrimeSummary } from './components/CrimeSummary';
// Hooks

export function PhaseGameOver({ state, players, user }: PhaseProps<PhaseGameOverState>) {
  const crimes: Crime[] = useMemo(() => orderBy(state.crimes ?? [], ['playerId']), [state.crimes]);

  const { isLocationGame, isVictimGame } = useGameTypes(state.items);

  return (
    <GameOverWrapper
      state={state}
      players={players}
      announcementIcon={<TrophyIcon />}
    >
      <Achievements
        players={players}
        achievements={state.achievements}
        reference={achievementsReference}
      />

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
            selectedVictimId={crime.victimId}
            selectedLocationId={crime.locationId}
            history={user.history?.[crime.playerId]}
            isVictimGame={isVictimGame}
            isLocationGame={isLocationGame}
          />
        ))}
      </ul>
    </GameOverWrapper>
  );
}
