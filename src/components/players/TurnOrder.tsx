import clsx from 'clsx';
import { Fragment, type ReactNode, useMemo } from 'react';
// Ant Design Resources
import { ForwardFilled } from '@ant-design/icons';
// Types
import type { GamePlayer, GamePlayers } from 'types/game';
// Utils
import { getAvatarColorById } from 'utils/helpers';
// Components
import { Translate } from 'components/language';
import { PlayerAvatarName } from 'components/player';
// Internal
import { reorder } from './reorder';
// Sass
import styles from './TurnOrder.module.scss';
// Styles

type TurnOrderProps = {
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
   *
   */
  additionalInfoParser?: (player: GamePlayer) => ReactNode;
};

export function TurnOrder({
  players,
  order,
  activePlayerId,
  reorderByUser,
  title,
  className = '',
  additionalInfoParser,
}: TurnOrderProps) {
  const orderList = useMemo(
    () => (reorderByUser ? reorder(order, reorderByUser) : order),
    [reorderByUser, order],
  );

  return (
    <div className={clsx(styles.turnOrder, className)}>
      <header className={styles.turnOrderTitle}>
        <Translate
          en="Player Order"
          pt="Ordem dos Jogadores"
          custom={title}
        />
      </header>
      <ol className={styles.turnOrderPlayers}>
        {orderList.map((playerId, index) => {
          const player = players[playerId];
          const isActive = activePlayerId === playerId;
          return (
            <Fragment key={`turn-order-player-${playerId}`}>
              <span
                className={clsx(styles.turnOrderPlayer, isActive && styles.turnOrderPlayerActive)}
                style={isActive ? { backgroundColor: getAvatarColorById(player.avatarId) } : undefined}
              >
                <PlayerAvatarName player={player} />
                {!!additionalInfoParser && additionalInfoParser(player)}
              </span>
              {index < order.length - 1 && (
                <span className={styles.turnOrderArrow}>
                  <ForwardFilled />
                </span>
              )}
            </Fragment>
          );
        })}
      </ol>
    </div>
  );
}
