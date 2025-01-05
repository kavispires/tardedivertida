import { orderBy } from 'lodash';
// Ant Design Resources
import { Avatar as AntAvatar, type AvatarProps, Tooltip } from 'antd';
// Types
import type { GamePlayer } from 'types/player';
// Internal
import { Avatar } from './Avatar';

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
  const players = orderBy(list, [(v) => v.id === user?.id, 'name'], ['asc']);

  return (
    <AntAvatar.Group max={{ count: maxCount }} size={size}>
      {players.map((player) => (
        <Tooltip key={`avatar-group-${player.id}`} title={`${tooltipPrefix}${player.name}`} trigger="hover">
          <Avatar id={player.avatarId} alt={player.name} size={size} {...avatarProps} />
        </Tooltip>
      ))}
    </AntAvatar.Group>
  );
}
