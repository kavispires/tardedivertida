import clsx from 'clsx';
// Design Resources
import { ForwardFilled } from '@ant-design/icons';
import { Translate } from '.';
import { AvatarName } from '..';
import { AVATARS } from '../../utils/constants';

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
                className={clsx('game-order__player', isActive && 'game-order__player--active')}
                key={`turn-order-player-${playerId}`}
                style={isActive ? { backgroundColor: AVATARS[player.avatarId].color } : undefined}
              >
                <AvatarName player={player} />
              </span>
              {index < order.length - 1 && (
                <span className="game-order__arrow" key={`turn-order-player-${playerId}-arrow`}>
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
