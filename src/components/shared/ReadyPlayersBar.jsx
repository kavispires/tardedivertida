import React from 'react';
// Design Resources
import { Avatar as AntAvatar, Typography } from 'antd';
import { LikeFilled } from '@ant-design/icons';
// Components
import Avatar from '../avatars/Avatar';

function ReadyPlayersBar({ players }) {
  const readyPlayers = Object.values(players).filter((player) => player.ready);

  if (readyPlayers.length === 0) {
    return <span></span>;
  }

  return (
    <div className="ready-player-bar">
      <AntAvatar.Group size="small">
        {readyPlayers.map((player) => (
          <Avatar key={player.name} id={player.avatarId} />
        ))}
      </AntAvatar.Group>
      <span className="ready-player-bar__speech-bubble">
        <Typography.Text>Estamos prontos!</Typography.Text>
        <LikeFilled className="ready-player-bar__speech-bubble-icon" />
      </span>
    </div>
  );
}

export default ReadyPlayersBar;
