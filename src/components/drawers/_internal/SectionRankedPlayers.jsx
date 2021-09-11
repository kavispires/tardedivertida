import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
// Design Resources
import { Badge } from 'antd';
// Hooks
import { useLanguage } from '../../../hooks';
// Utils
import { AVATARS } from '../../../utils/constants';
import { orderBy } from '../../../utils';
// Components
import { Avatar } from '../../avatars';

export function SectionRankedPlayers({ players }) {
  const language = useLanguage();

  const rankedPlayers = useMemo(() => orderBy(Object.values(players), ['score', 'name'], ['desc', 'asc']), [
    players,
  ]);
  return (
    <ul>
      {rankedPlayers.map((player, index) => {
        return (
          <div className="game-info-drawer__ranked-player" key={`ranked-${player.name}`}>
            {index + 1}.{' '}
            <Badge count={player.score} className="game-info-drawer__avatar-with-badge">
              <Avatar id={player.avatarId} shape="square" />
            </Badge>
            {player.name}, {AVATARS[player.avatarId].description[language]}
          </div>
        );
      })}
    </ul>
  );
}

SectionRankedPlayers.propTypes = {
  players: PropTypes.objectOf(
    PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      avatarId: PropTypes.string,
      score: PropTypes.number,
    })
  ),
};
