import { orderBy } from 'lodash';
// Hooks
import { useUser } from 'hooks/useUser';
// Components
import { GameOverWrapper } from 'components/game-over';
import { Crime } from './components/Crime';
import { TrophyIcon } from 'components/icons/TrophyIcon';

function PhaseGameOver({ state, players, info }: PhaseProps) {
  const crimes: Crime[] = state.crimes;
  const user = useUser(players, state);

  return (
    <GameOverWrapper info={info} state={state} announcementIcon={<TrophyIcon />}>
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
