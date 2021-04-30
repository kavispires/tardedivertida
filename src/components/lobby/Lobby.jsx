import React, { useEffect, useState } from 'react';
// Design Resources
import { Layout } from 'antd';
// State
import useGlobalState from '../../hooks/useGlobalState';
// Utils
import gameList from '../../resources/games.json';
// Components
import AvatarEntry from './../AvatarEntry';
import Join from './Join';
import Waiting from './Waiting';

function Lobby({ state }) {
  const [gameId] = useGlobalState('gameId');
  const [me] = useGlobalState('me');
  const [myAvatar] = useGlobalState('myAvatar');
  const [gameDescription, setGameDescription] = useState({});

  // Update game description as the gameId comes in
  useEffect(() => {
    setGameDescription(gameId?.[0] ? gameList[gameId[0]] : {});
  }, [gameId]);

  return (
    <Layout.Content className="lobby">
      <div className="lobby__room">
        {Object.values(state?.players ?? {}).map((player, index) => (
          <AvatarEntry
            key={player.name}
            id={player.avatarId}
            name={player.name}
            className={`lobby__seat lobby__seat--${index}`}
            animate
          />
        ))}

        {me && myAvatar ? (
          <Waiting players={state?.players ?? {}} gameDescription={gameDescription} />
        ) : (
          <Join players={state?.players ?? {}} gameDescription={gameDescription} />
        )}
      </div>
    </Layout.Content>
  );
}

export default Lobby;
