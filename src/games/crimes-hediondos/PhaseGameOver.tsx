// Components
import { useMemo } from 'react';
import { GameOverWrapper } from '../../components';
import { useLanguage, useUser } from '../../hooks';
import { Crime } from './Crime';
import { splitWeaponsAndEvidence } from './helpers';

function PhaseGameOver({ state, players, info }: PhaseProps) {
  const { language } = useLanguage();
  const crimes: Crime[] = state.crimes;
  const user = useUser(players);

  const { weapons, evidences } = useMemo(
    () => splitWeaponsAndEvidence(state.items, language),
    [state.items, language]
  );

  return (
    <GameOverWrapper info={info} state={state} announcementIcon="trophy">
      <ul>
        {crimes.map((crime) => (
          <Crime
            key={`crime-by-${crime.playerId}`}
            user={user}
            crime={crime}
            players={players}
            scenes={state.scenes}
            scenesOrder={state.scenesOrder}
            items={state.items}
            weapons={weapons}
            evidences={evidences}
          />
        ))}
      </ul>
    </GameOverWrapper>
  );
}

export default PhaseGameOver;
