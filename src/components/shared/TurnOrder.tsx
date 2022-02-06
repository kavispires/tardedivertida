import clsx from 'clsx';
// Design Resources
import { ForwardFilled } from '@ant-design/icons';
// Helpers
import { getAvatarColorById } from '../../utils/helpers';
// Components
import { Translate } from '.';
import { AvatarName } from '..';

type TurnOrderProps = {
  players: GamePlayers;
  order: PlayerId[];
  activePlayerId?: PlayerId;
};

export function TurnOrder({ players, order, activePlayerId }: TurnOrderProps) {
  return (
    <div className="game-order">
      <h4 className="game-order__title">
        <Translate en="Turn Order" pt="Ordem dos Jogadores" />
      </h4>
      <ul className="game-order__players">
        {order.map((playerId, index) => {
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
