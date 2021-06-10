import React from 'react';
import PropTypes from 'prop-types';
// Design Resources
import { Avatar as AntAvatar, Typography } from 'antd';
import { LikeFilled } from '@ant-design/icons';
// Components
import { Avatar } from '../avatars';

export function ReadyPlayersBar({
  players,
  readyText = 'Estou pronto!',
  readyTextPlural = 'Estamos prontos!',
  showNames,
}) {
  const readyPlayers = Object.values(players).filter((player) => player.ready);

  if (readyPlayers.length === 0) {
    return <span></span>;
  }

  return (
    <div className="ready-player-bar">
      <div className="ready-player-bar__bar">
        <AntAvatar.Group size="small">
          {readyPlayers.map((player) => (
            <Avatar key={player.name} id={player.avatarId} />
          ))}
        </AntAvatar.Group>
        <span className="ready-player-bar__speech-bubble">
          <Typography.Text>{readyPlayers.length > 1 ? readyTextPlural : readyText}</Typography.Text>
          <LikeFilled className="ready-player-bar__speech-bubble-icon" />
        </span>
      </div>
      {showNames && (
        <span className="ready-player-bar__names">
          ({readyPlayers.map((player) => player.name).join(', ')})
        </span>
      )}
    </div>
  );
}

ReadyPlayersBar.propTypes = {
  players: PropTypes.object.isRequired,
  readyText: PropTypes.string,
  readyTextPlural: PropTypes.string,
  showNames: PropTypes.bool,
};

ReadyPlayersBar.defaultProps = {
  readyText: 'Estou pronto!',
  readyTextPlural: 'Estamos prontos!',
  showNames: false,
};
