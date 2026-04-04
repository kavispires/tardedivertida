import { orderBy } from 'lodash';
import { useMemo } from 'react';
// Ant Design Resources
import { Badge, Tag } from 'antd';
// Types
import type { GamePlayers } from 'types/game';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
import { useUser } from 'hooks/useUser';
// Utils
import { AVATARS } from 'utils/avatars';
// Components
import { Translate } from 'components/language/Translate';
import { PlayerAvatar } from 'components/player/PlayerAvatar';
// Sass
import styles from '../drawers.module.scss';

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
            className={styles.gameInfoDrawer__rankedPlayer}
            key={`ranked-${player.name}`}
          >
            {index + 1}.{' '}
            <Badge
              count={player.score}
              className={styles.gameInfoDrawer__avatarWithBadge}
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
                className={styles.gameInfoDrawer__avatarTag}
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
