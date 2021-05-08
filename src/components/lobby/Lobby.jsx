import React from 'react';
// Hooks
import useGlobalState from '../../hooks/useGlobalState';
// Components
import PhaseContainer from '../shared/PhaseContainer';
import AvatarEntry from '../avatars/AvatarEntry';
import Join from './Join';
import Waiting from './Waiting';
import CloudBackground from './CloudBackground';

function Lobby({ players, info }) {
  const [me] = useGlobalState('me');
  const [myAvatar] = useGlobalState('myAvatar');

  return (
    <PhaseContainer phase="LOBBY" allowedPhase="LOBBY" info={info}>
      <div className="lobby__room">
        {Object.values(players).map((player, index) => (
          <AvatarEntry
            key={player.name}
            id={player.avatarId}
            name={player.name}
            className={`lobby__seat lobby__seat--${index}`}
            animate
          />
        ))}

        {me && myAvatar ? <Waiting players={players} info={info} /> : <Join players={players} info={info} />}
      </div>

      <CloudBackground />
    </PhaseContainer>
  );
}

export default Lobby;
