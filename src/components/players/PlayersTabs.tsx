import { orderBy } from 'lodash';
import { type ReactNode, useMemo } from 'react';
// Ant Design Resources
import { Tabs, type TabsProps } from 'antd';
// Types
import type { GamePlayer } from 'types/game';
// Components
import { Translate } from '@components/language/Translate';
import { PlayerAvatar } from '@components/player/PlayerAvatar';

type PlayersTabsProps = {
  list: {
    player: GamePlayer;
    content: ReactNode;
  }[];
  user?: GamePlayer;
} & Omit<TabsProps, 'items'>;

/**
 * Tabs component with player names and icons sorted alphabetically by name
 */
export function PlayersTabs({ list, user, ...props }: PlayersTabsProps) {
  const options = useMemo(
    () =>
      orderBy(list, [(o) => o.player.name.toLowerCase()], ['asc']).map(({ player, content }) => ({
        key: player.id,
        value: player.id,
        icon: (
          <PlayerAvatar
            avatarId={player.avatarId}
            size="small"
          />
        ),
        label: <div>{player.name}</div>,
        children: content ?? (
          <Translate
            pt="Nenhum conteúdo para este jogador."
            en="No content for this player."
          />
        ),
      })),

    [list],
  );

  return (
    <Tabs
      defaultActiveKey={user?.id}
      items={options}
      type="card"
      styles={{
        header: { marginBottom: 0 },
        content: {
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
        },
      }}
      animated
      classNames={{
        content: 'contained',
      }}
      {...props}
    />
  );
}
