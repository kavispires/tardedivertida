import { useMemo } from 'react';
import { orderBy } from 'lodash';
// Hooks
import { useLanguage } from 'hooks';
// Utils
import { AVATARS } from 'utils/constants';
// Components
import { Avatar, Translate } from 'components';

type SectionTeamPlayersProp = {
  team: GameTeam;
  players: GamePlayers;
};

export function SectionTeamPlayers({ team, players }: SectionTeamPlayersProp) {
  const { language } = useLanguage();

  const sortedPlayers = useMemo(
    () =>
      orderBy(
        team.members.map((playerId) => {
          return players[playerId];
        }),
        ['name'],
        ['asc']
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
