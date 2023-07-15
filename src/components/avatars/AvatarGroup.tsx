// Ant Design Resources
import { Avatar as AntAvatar, AvatarProps, Tooltip } from 'antd';
// Components
import { Avatar } from './Avatar';
import { orderBy } from 'lodash';

type AvatarGroupProps = {
  list: GamePlayer[];
  user?: GamePlayer;
  maxCount?: number;
} & AvatarProps;

/**
 * Displays a group of avatars
 */
export function AvatarGroup({ list, user, maxCount = 3, size, ...avatarProps }: AvatarGroupProps) {
  const players = orderBy(list, [(v) => v.id === user?.id, 'name'], ['asc']);

  return (
    <AntAvatar.Group maxCount={maxCount} size={size}>
      {players.map((player) => (
        <Tooltip key={`avatar-group-${player.id}`} title={player.name}>
          <Avatar id={player.avatarId} alt={player.name} size={size} {...avatarProps} />
        </Tooltip>
      ))}
    </AntAvatar.Group>
  );
}
