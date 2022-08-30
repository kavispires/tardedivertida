import clsx from 'clsx';
import { orderBy } from 'lodash';
// Ant Design Resources
import { Badge } from 'antd';
// Hooks
import { useGlobalState } from 'hooks/useGlobalState';
// Utils
import { getAnimationClass } from 'utils/helpers';
// Components
import { Avatar } from 'components/avatars';
import { Translate } from 'components/language';

type PlayersStatusBarProps = {
  players: GamePlayers;
  onClick: GenericFunction;
};

export function PlayersStatusBar({ players, onClick }: PlayersStatusBarProps) {
  const [showPlayersBar] = useGlobalState('showPlayersBar');

  if (!showPlayersBar) {
    return <></>;
  }

  const sortedPlayers = orderBy(Object.values(players), ['name']);

  return (
    <button onClick={onClick} className={clsx('players-status-bar', getAnimationClass('slideInRight'))}>
      <ul className="players-status-bar__list">
        {Object.values(sortedPlayers).map((player) => {
          return (
            <li className="players-status-bar__player" key={`players-status-bar-${player.id}`}>
              <Badge dot color={player.ready ? 'green' : 'gray'}>
                <Avatar
                  id={player.avatarId}
                  alt={player.name}
                  size="small"
                  className={clsx(!player.ready && 'players-status-bar__avatar-not-ready')}
                />
              </Badge>
              {player.ready && (
                <div className="players-status-bar__ready">
                  <div className="players-status-bar__ready-speech">
                    <Translate pt="Pronto!" en="I'm ready!" />
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </button>
  );
}
