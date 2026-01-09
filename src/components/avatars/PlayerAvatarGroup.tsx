import { orderBy } from 'lodash';
import { useMemo } from 'react';
// Ant Design Resources
import { Avatar, type AvatarProps, Tooltip } from 'antd';
// Types
import type { GamePlayer } from 'types/player';
// Internal
import { PlayerAvatar } from './PlayerAvatar';

type AvatarGroupProps = {
  list: GamePlayer[];
  user?: GamePlayer;
  maxCount?: number;
  tooltipPrefix?: string;
} & AvatarProps;

/**
 * Displays a group of avatars
 */
export function AvatarGroup({
  list,
  user,
  maxCount = 3,
  size,
  tooltipPrefix = '',
  ...avatarProps
}: AvatarGroupProps) {
  const players = useMemo(
    () => orderBy(list, [(v) => v.id === user?.id, 'name'], ['desc', 'asc']),
    [list, user],
  );

  return (
    <Avatar.Group
      max={{ count: maxCount }}
      size={size}
    >
      {players.map((player) => (
        <Tooltip
          key={`avatar-group-${player.id}`}
          title={`${tooltipPrefix}${player.name}`}
          trigger="hover"
        >
          <PlayerAvatar
            avatarId={player.avatarId}
            alt={player.name}
            size={size}
            {...avatarProps}
          />
        </Tooltip>
      ))}
    </Avatar.Group>
  );
}
