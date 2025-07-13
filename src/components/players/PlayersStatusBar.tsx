import clsx from 'clsx';
// Ant Design Resources
import { Badge, Tooltip } from 'antd';
// Types
import type { GamePlayers } from 'types/player';
// Hooks
import { useGlobalState } from 'hooks/useGlobalState';
// Utils
import { getAnimationClass, sortPlayers } from 'utils/helpers';
// Components
import { Avatar } from 'components/avatars';
import { Translate } from 'components/language';
// Sass
import './PlayersStatusBar.scss';

type PlayersStatusBarProps = {
  players: GamePlayers;
};

export function PlayersStatusBar({ players }: PlayersStatusBarProps) {
  const [showPlayersBar] = useGlobalState('showPlayersBar');

  if (!showPlayersBar) {
    return null;
  }

  return (
    <div className={clsx('players-status-bar', getAnimationClass('slideInRight'))}>
      <ul className="players-status-bar__list">
        {sortPlayers(players).map((player) => {
          return (
            <li className="players-status-bar__player" key={`players-status-bar-${player.id}`}>
              <Tooltip title={player.name} placement="left" trigger="hover">
                <Badge dot color={player.ready ? 'green' : 'gray'}>
                  <Avatar
                    id={player.avatarId}
                    alt={player.name}
                    size="small"
                    className={clsx(!player.ready && 'players-status-bar__avatar-not-ready')}
                  />
                </Badge>
              </Tooltip>
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
    </div>
  );
}
