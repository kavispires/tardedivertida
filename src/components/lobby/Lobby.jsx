import React from 'react';
// Design Resources
import { Layout } from 'antd';
// State
import useGlobalState from '../../hooks/useGlobalState';

// Components
import AvatarEntry from './../AvatarEntry';
import Join from './Join';
import Waiting from './Waiting';

function Lobby({ players, info }) {
  const [me] = useGlobalState('me');
  const [myAvatar] = useGlobalState('myAvatar');

  return (
    <Layout.Content className="lobby">
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
    </Layout.Content>
  );
}

export default Lobby;
