import clsx from 'clsx';
import { Fragment, type ReactNode, useMemo } from 'react';
// Ant Design Resources
import { BackwardFilled } from '@ant-design/icons';
// Types
import type { GamePlayers } from 'types/game';
// Utils
import { getAvatarColorById } from 'utils/helpers';
// Icons
import { TableIcon } from 'icons/TableIcon';
// Components
import { Translate } from 'components/language';
import { PlayerAvatarName } from 'components/player';
// Internal
import { reorder } from './reorder';
// Sass
import styles from './TableOrder.module.scss';
// Styles

type TableOrderProps = {
  /**
   * Game players
   */
  players: GamePlayers;
  /**
   * The order array
   */
  order: UID[];
  /**
   * The active player who should be highlighted
   */
  activePlayerId?: UID;
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
  reorderByUser?: UID;
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
    <div className={clsx(styles.tableOrder, size && styles.tableOrderSmall, className)}>
      <ol className={styles.tableOrderPlayers}>
        {orderedList.map((playerId, index) => {
          const player = players[playerId];
          const isActive = activePlayerId === playerId;
          const color = getAvatarColorById(player.avatarId);
          return (
            <Fragment key={`table-order-${playerId}`}>
              <li
                // @ts-expect-error
                style={{ '--t': doublePlayerCount, '--i': index * 2 }}
                className={clsx(styles.tableOrderPlayer, isActive && styles.tableOrderPlayerActive)}
              >
                <span
                  className={styles.tableOrderIcon}
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
                className={styles.tableOrderChevron}
              >
                <span className={styles.tableOrderIcon}>
                  <BackwardFilled />
                </span>
              </li>
            </Fragment>
          );
        })}
        <li className={styles.tableOrderCenter}>
          <div className={styles.tableOrderCenterContainer}>
            <TableIcon style={{ width: '3rem', transform: 'scaleX(-1)' }} />
            <header className={styles.tableOrderTitle}>
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
