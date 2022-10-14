import { Fragment, ReactNode, useMemo } from 'react';
import clsx from 'clsx';
// Ant Design Resources
import { ForwardFilled } from '@ant-design/icons';
// Helpers
import { getAvatarColorById } from 'utils/helpers';
import { reorder } from './reorder';
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
    <div className={clsx('turn-order', className)}>
      <header className="turn-order__title">
        <Translate en="Player Order" pt="Ordem dos Jogadores" custom={title} />
      </header>
      <ol className="turn-order__players">
        {orderList.map((playerId, index) => {
          const player = players[playerId];
          const isActive = activePlayerId === playerId;
          return (
            <Fragment key={`turn-order-player-${playerId}`}>
              <span
                className={clsx('turn-order__player', isActive && 'turn-order__player--active')}
                style={isActive ? { backgroundColor: getAvatarColorById(player.avatarId) } : undefined}
              >
                <AvatarName player={player} />
              </span>
              {index < order.length - 1 && (
                <span className="turn-order__arrow">
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
