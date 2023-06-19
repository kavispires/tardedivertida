import { orderBy } from 'lodash';
// Hooks
import { useUser } from 'hooks/useUser';
// Utils
import achievementsReference from './utils/achievements';
// Icons
import { TrophyIcon } from 'icons/TrophyIcon';
// Components
import { GameOverWrapper } from 'components/game-over';
import { Crime } from './components/Crime';
import { Achievements } from 'components/general/Achievements';

function PhaseGameOver({ state, players, info }: PhaseProps) {
  const crimes: Crime[] = state.crimes;
  const user = useUser(players, state);

  return (
    <GameOverWrapper info={info} state={state} players={players} announcementIcon={<TrophyIcon />}>
      <Achievements players={players} achievements={state.achievements} reference={achievementsReference} />

      <ul>
        {orderBy(crimes, ['playerId']).map((crime) => (
          <Crime
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

export default PhaseGameOver;
