import clsx from 'clsx';
import { orderBy } from 'lodash';
import { type ReactNode, useMemo } from 'react';
// Ant Design Resources
import { InfoCircleOutlined } from '@ant-design/icons';
import { Avatar, Tooltip, type TooltipProps } from 'antd';
// Types
import type { GamePlayer, GamePlayers } from 'types/player';
// Utils
import { getAvatarColorById } from 'utils/helpers';
// Components
import { IconAvatar, PlayerAvatar, type PlayerAvatarProps } from 'components/avatars';
// Sass
import './PlayerCounts.scss';

type PlayerCountsProps = {
  players: GamePlayers;
  turnOrder: GameOrder;
  countGetter: (player: GamePlayer) => number;
  sortBy?: 'name' | 'count' | 'turn-order';
  size?: PlayerAvatarProps['size'];
  title: TooltipProps['title'];
  icon?: ReactNode;
} & Omit<React.HTMLAttributes<HTMLDivElement>, 'title'>;

export function PlayerCounts({
  players,
  turnOrder,
  sortBy = 'turn-order',
  countGetter,
  size,
  title,
  className,
  icon,
  ...rest
}: PlayerCountsProps) {
  // biome-ignore lint/correctness/useExhaustiveDependencies: not the function
  const values = useMemo(() => {
    return Object.values(players).reduce((acc: NumberDictionary, player) => {
      const count = countGetter(player);
      acc[player.id] = count;
      return acc;
    }, {});
  }, [players]);

  const order = orderBy(
    Object.values(players),
    [
      (o) => {
        switch (sortBy) {
          case 'name':
            return o.name.toLowerCase();
          case 'count':
            return -values[o.id]; // Descending
          case 'turn-order':
            return turnOrder.indexOf(o.id);
          default:
            return turnOrder.indexOf(o.id);
        }
      },
      'name',
    ],
    ['asc'],
  );

  return (
    <div
      className={clsx('player-counts', className)}
      {...rest}
    >
      <ol className="player-counts__players">
        {title && (
          <div className="player-counts__title">
            <Tooltip title={title}>
              <IconAvatar
                size={size}
                icon={icon ?? <InfoCircleOutlined style={{ color: 'black' }} />}
              />
            </Tooltip>
          </div>
        )}
        {order.map((player) => {
          return (
            <span
              key={`player-counts-player-${player.id}`}
              className={clsx('player-counts__player')}
              style={{ backgroundColor: getAvatarColorById(player.avatarId) }}
            >
              <Tooltip title={player.name}>
                <PlayerAvatar
                  avatarId={player.avatarId}
                  size={size}
                />{' '}
                <Avatar size={size}>{values[player.id]}</Avatar>
              </Tooltip>
            </span>
          );
        })}
      </ol>
    </div>
  );
}
