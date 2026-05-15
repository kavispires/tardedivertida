import clsx from 'clsx';
import { Fragment, type ReactNode, useMemo } from 'react';
// Ant Design Resources
import { ForwardFilled } from '@ant-design/icons';
// Types
import type { GamePlayer, GamePlayers } from 'types/game';
// Utils
import { getAvatarColorById } from 'utils/helpers';
// Components
import { Translate } from 'components/language/Translate';
import { PlayerAvatarName } from 'components/player/PlayerAvatarName';
// Internal
import { reorder } from './reorder';
// Sass
import styles from './PlayersTurnOrder.module.scss';

type PlayersTurnOrderProps = {
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
   * Optional function to parse and display additional player information
   */
  additionalInfoParser?: (player: GamePlayer) => ReactNode;
};

/**
 * Horizontal turn order display with player avatars arranged in sequence
 */
export function PlayersTurnOrder({
  players,
  order,
  activePlayerId,
  reorderByUser,
  title,
  className = '',
  additionalInfoParser,
}: PlayersTurnOrderProps) {
  const orderList = useMemo(
    () => (reorderByUser ? reorder(order, reorderByUser) : order),
    [reorderByUser, order],
  );

  return (
    <div className={clsx(styles.playersTurnOrder, className)}>
      <header className={styles.playersTurnOrderTitle}>
        <Translate
          en="Player Order"
          pt="Ordem dos Jogadores"
          custom={title}
        />
      </header>
      <ol className={styles.playersTurnOrderPlayers}>
        {orderList.map((playerId, index) => {
          const player = players[playerId];
          const isActive = activePlayerId === playerId;
          return (
            <Fragment key={`turn-order-player-${playerId}`}>
              <span
                className={clsx(
                  styles.playersTurnOrderPlayer,
                  isActive && styles.playersTurnOrderPlayerActive,
                )}
                style={isActive ? { backgroundColor: getAvatarColorById(player.avatarId) } : undefined}
              >
                <PlayerAvatarName player={player} />
                {!!additionalInfoParser && additionalInfoParser(player)}
              </span>
              {index < order.length - 1 && (
                <span className={styles.playersTurnOrderArrow}>
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
