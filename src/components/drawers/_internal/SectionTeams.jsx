import PropTypes from 'prop-types';
import React from 'react';

// Components
import { SectionTeamPlayers } from './SectionTeamPlayers';

export function SectionTeams({ players, teams }) {
  return (
    <div className="game-info-drawer__team-players">
      {Object.values(teams).map((team) => (
        <SectionTeamPlayers key={team.name} team={team} players={players} />
      ))}
    </div>
  );
}

SectionTeams.propTypes = {
  players: PropTypes.objectOf(
    PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      avatarId: PropTypes.string,
      score: PropTypes.number,
    })
  ),
  teams: PropTypes.objectOf(
    PropTypes.shape({
      members: PropTypes.arrayOf(PropTypes.string),
      name: PropTypes.string,
    })
  ),
};
