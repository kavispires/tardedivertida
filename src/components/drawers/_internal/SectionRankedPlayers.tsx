import { useMemo } from 'react';
import { orderBy } from 'lodash';
// Ant Design Resources
import { Badge } from 'antd';
// Hooks
import { useLanguage } from 'hooks';
// Utils
import { AVATARS } from 'utils/constants';
// Components
import { Avatar } from 'components/avatars';

type SectionRankedPlayersProps = {
  players: GamePlayers;
};

export function SectionRankedPlayers({ players }: SectionRankedPlayersProps) {
  const { language } = useLanguage();

  const rankedPlayers = useMemo(
    () => orderBy(Object.values(players), ['score', 'name'], ['desc', 'asc']),
    [players]
  );
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
