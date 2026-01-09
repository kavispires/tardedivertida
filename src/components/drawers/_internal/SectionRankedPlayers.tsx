import { orderBy } from 'lodash';
import { useMemo } from 'react';
// Ant Design Resources
import { Badge, Tag } from 'antd';
// Types
import type { GamePlayers } from 'types/player';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
import { useUser } from 'hooks/useUser';
// Utils
import { AVATARS } from 'utils/avatars';
// Components
import { PlayerAvatar } from 'components/avatars';
import { Translate } from 'components/language';

type SectionRankedPlayersProps = {
  players: GamePlayers;
};

export function SectionRankedPlayers({ players }: SectionRankedPlayersProps) {
  const { language } = useLanguage();
  const user = useUser(players);

  const rankedPlayers = useMemo(
    () => orderBy(Object.values(players), ['score', 'name'], ['desc', 'asc']),
    [players],
  );
  return (
    <ul>
      {rankedPlayers.map((player, index) => {
        return (
          <div
            className="game-info-drawer__ranked-player"
            key={`ranked-${player.name}`}
          >
            {index + 1}.{' '}
            <Badge
              count={player.score}
              className="game-info-drawer__avatar-with-badge"
            >
              <PlayerAvatar
                avatarId={player.avatarId}
                shape="square"
              />
            </Badge>
            {player.name}, {AVATARS[player.avatarId].description[language]}
            {player.id === user.id && (
              <Tag
                color={AVATARS[player.avatarId].color}
                className="game-info-drawer__avatar-tag"
              >
                <Translate
                  pt="VOCÊ"
                  en="YOU"
                />
              </Tag>
            )}
          </div>
        );
      })}
    </ul>
  );
}
