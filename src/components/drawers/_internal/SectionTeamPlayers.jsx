import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
// Utils
import { AVATARS } from '../../../utils/constants';
import { orderBy } from '../../../utils';
// Components
import { Avatar } from '../../avatars';
import { Translate } from '../../shared';
import { useLanguage } from '../../../hooks';

export function SectionTeamPlayers({ team, players }) {
  const language = useLanguage();

  const sortedPlayers = useMemo(
    () =>
      orderBy(
        team.members.map((playerId) => {
          return players[playerId];
        }),
        'name'
      ),
    [players, team]
  );

  return (
    <div className="game-info-drawer__team" key={team.name}>
      <h3>
        <Translate pt="Time " en="Team " />
        {team.name}
      </h3>
      <ul>
        {sortedPlayers.map((player) => {
          return (
            <div className="game-info-drawer__ranked-player" key={`ranked-${player.id}`}>
              <Avatar id={player.avatarId} shape="square" className="game-info-drawer__avatar-with-badge" />
              {player.name}, {AVATARS[player.avatarId].description[language]}
            </div>
          );
        })}
      </ul>
    </div>
  );
}

SectionTeamPlayers.propTypes = {
  players: PropTypes.objectOf(
    PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      avatarId: PropTypes.string,
    })
  ).isRequired,
  team: PropTypes.shape({
    members: PropTypes.arrayOf(PropTypes.string),
    name: PropTypes.string,
  }).isRequired,
};
