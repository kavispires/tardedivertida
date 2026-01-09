import clsx from 'clsx';
import { Fragment, type ReactNode, useMemo } from 'react';
// Ant Design Resources
import { BackwardFilled } from '@ant-design/icons';
// Types
import type { GamePlayers } from 'types/player';
// Utils
import { getAvatarColorById } from 'utils/helpers';
// Icons
import { TableIcon } from 'icons/TableIcon';
// Components
import { PlayerAvatarName } from 'components/avatars';
import { Translate } from 'components/language';
// Internal
import { reorder } from './reorder';
// Sass
import './TableOrder.scss';

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
    () => (reorderByUser ? reorder(order, reorderByUser) : order),
    [reorderByUser, order],
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
                // @ts-expect-error
                style={{ '--t': doublePlayerCount, '--i': index * 2 }}
                className={clsx('table-order__player', isActive && 'table-order__player--active')}
              >
                <span
                  className="table-order__icon"
                  style={isActive ? { backgroundColor: color } : undefined}
                >
                  <PlayerAvatarName
                    player={player}
                    upright
                  />
                </span>
              </li>
              <li
                // @ts-expect-error
                style={{ '--t': doublePlayerCount, '--i': index * 2 + 1 }}
                className="table-order__chevron"
              >
                <span className="table-order__icon">
                  <BackwardFilled />
                </span>
              </li>
            </Fragment>
          );
        })}
        <li className="table-order__center">
          <div className="table-order__center-container">
            <TableIcon style={{ width: '3rem', transform: 'scaleX(-1)' }} />
            <header className="table-order__title">
              <Translate
                en="Player Order"
                pt="Ordem dos Jogadores"
                custom={title}
              />
            </header>
          </div>
        </li>
      </ol>
    </div>
  );
}
