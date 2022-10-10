import { Fragment, ReactNode, useMemo } from 'react';
import clsx from 'clsx';
// Helpers
import { getAvatarColorById } from 'utils/helpers';
import { reorder } from './reorder';
// Components
import { Translate } from 'components/language';
import { AvatarName } from 'components/avatars';
import { RotationIcon } from 'components/icons/RotationIcon';
import { ForwardFilled } from '@ant-design/icons';

type TableOrderProps = {
  /**
   * Game players
   */
  players: GamePlayers;
  /**
   * The order array
   */
  order: PlayerId[];
  /**
   * The active player who should be highlighted
   */
  activePlayerId?: PlayerId;
  /**
   * Optional custom title
   */
  title?: ReactNode;
  /**
   * Optional custom class name
   */
  className?: string;
  /**
   * Reorder turn order so it starts with given player
   */
  reorderByUser?: PlayerId;
  /**
   * The size of the table order
   */
  size?: 'default' | 'small';
};

/**
 * Circular Table/Turn order display
 * @param props
 * @returns
 */
export function TableOrder({
  players,
  order,
  activePlayerId,
  reorderByUser,
  title,
  className = '',
  size,
}: TableOrderProps) {
  const orderedList = useMemo(
    () => (Boolean(reorderByUser) ? reorder(order, reorderByUser!) : order),
    [reorderByUser, order]
  );
  const doublePlayerCount = orderedList.length * 2;

  return (
    <div className={clsx('table-order', size && `table-order--${size}`, className)}>
      <ol className="table-order__players">
        {orderedList.map((playerId, index) => {
          const player = players[playerId];
          const isActive = activePlayerId === playerId;
          const color = getAvatarColorById(player.avatarId);
          return (
            <Fragment key={`table-order-${playerId}`}>
              <li
                // @ts-ignore
                style={{ '--t': doublePlayerCount, '--i': index * 2 }}
                className={clsx('table-order__player', isActive && 'table-order__player--active')}
              >
                <span className="table-order__icon" style={isActive ? { backgroundColor: color } : undefined}>
                  <AvatarName player={player} upright />
                </span>
              </li>
              <li
                // @ts-ignore
                style={{ '--t': doublePlayerCount, '--i': index * 2 + 1 }}
                className="table-order__chevron"
              >
                <span className="table-order__icon">
                  <ForwardFilled />
                </span>
              </li>
            </Fragment>
          );
        })}
        <li className="table-order__center">
          <div className="table-order__center-container">
            <RotationIcon style={{ width: '3rem' }} />
            <header className="table-order__title">
              <Translate en="Player Order" pt="Ordem dos Jogadores" custom={title} />
            </header>
          </div>
        </li>
      </ol>
    </div>
  );
}
