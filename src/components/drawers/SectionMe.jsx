import PropTypes from 'prop-types';
import React from 'react';
// Design Resources
import { Badge } from 'antd';
// Utils
import { AVATARS } from '../../utils/constants';
// Components
import { Avatar } from '../avatars';

export function SectionMe({ player, isTeamGame }) {
  return (
    <div className="game-info-drawer__section-me">
      <div className="game-info-drawer__label">Você é{isTeamGame && ` do time ${player?.team ?? '?'}`}</div>
      <div className="game-info-drawer__me">
        <Badge count={player.score} className="game-info-drawer__avatar-with-badge">
          <Avatar id={player.avatarId} shape="square" />
        </Badge>
        {player.name}, {AVATARS[player.avatarId].description.br}
      </div>
    </div>
  );
}

SectionMe.propTypes = {
  isTeamGame: PropTypes.bool,
  player: PropTypes.shape({
    avatarId: PropTypes.string,
    name: PropTypes.string,
    score: PropTypes.number,
    team: PropTypes.string,
  }),
};

SectionMe.defaultProps = {
  isTeamGame: false,
};
