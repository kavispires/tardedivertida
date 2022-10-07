import { ReactNode, useMemo } from 'react';
import clsx from 'clsx';
// Ant Design Resources
import { ForwardFilled } from '@ant-design/icons';
// Helpers
import { getAvatarColorById } from 'utils/helpers';
// Components
import { Translate } from 'components/language';
import { AvatarName } from 'components/avatars';

type TurnOrderProps = {
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
};

export function TurnOrder({
  players,
  order,
  activePlayerId,
  reorderByUser,
  title,
  className = '',
}: TurnOrderProps) {
  const orderList = useMemo(
    () => (Boolean(reorderByUser) ? reorder(order, reorderByUser!) : order),
    [reorderByUser, order]
  );

  return (
    <div className={clsx('game-order', className)}>
      <header className="game-order__title">
        <Translate en="Player Order" pt="Ordem dos Jogadores" custom={title} />
      </header>
      <ul className="game-order__players">
        {orderList.map((playerId, index) => {
          const player = players[playerId];
          const isActive = activePlayerId === playerId;
          return (
            <>
              <span
                key={`turn-order-player-${playerId}`}
                className={clsx('game-order__player', isActive && 'game-order__player--active')}
                style={isActive ? { backgroundColor: getAvatarColorById(player.avatarId) } : undefined}
              >
                <AvatarName player={player} />
              </span>
              {index < order.length - 1 && (
                <span key={`turn-order-player-${playerId}-arrow`} className="game-order__arrow">
                  <ForwardFilled />
                </span>
              )}
            </>
          );
        })}
      </ul>
    </div>
  );
}

function reorder(order: PlayerId[], startWith: PlayerId): PlayerId[] {
  const starterIndex = order.indexOf(startWith);

  return [...order.slice(starterIndex), ...order.slice(0, starterIndex)];
}
