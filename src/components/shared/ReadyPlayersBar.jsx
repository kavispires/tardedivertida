import React from 'react';
import PropTypes from 'prop-types';
// Design Resources
import { Avatar as AntAvatar, Typography } from 'antd';
import { LikeFilled } from '@ant-design/icons';
// Components
import Avatar from '../avatars/Avatar';

function ReadyPlayersBar({ players, readyLabel = 'Estou pronto!', readyLabelPlural = 'Estamos prontos!' }) {
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
        <Typography.Text>{readyPlayers.length > 1 ? readyLabelPlural : readyLabel}</Typography.Text>
        <LikeFilled className="ready-player-bar__speech-bubble-icon" />
      </span>
    </div>
  );
}

ReadyPlayersBar.propTypes = {
  players: PropTypes.object.isRequired,
  readyLabel: PropTypes.string,
  readyLabelPlural: PropTypes.string,
};

ReadyPlayersBar.defaultProps = {
  readyLabel: 'Estou pronto!',
  readyLabelPlural: 'Estamos prontos!',
};

export default ReadyPlayersBar;
