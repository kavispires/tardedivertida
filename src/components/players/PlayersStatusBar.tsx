import clsx from 'clsx';
// Ant Design Resources
import { Badge, Tooltip } from 'antd';
// Types
import type { GamePlayers } from 'types/game';
// Hooks
import { useGlobalState } from 'hooks/useGlobalState';
// Utils
import { getAnimationClass, sortPlayers } from 'utils/helpers';
// Components
import { Translate } from 'components/language/Translate';
import { PlayerAvatar } from 'components/player/PlayerAvatar';
// Sass
import styles from './PlayersStatusBar.module.scss';

type PlayersStatusBarProps = {
  players: GamePlayers;
};

/**
 * Horizontal status bar component that displays all players with their current game status
 */
export function PlayersStatusBar({ players }: PlayersStatusBarProps) {
  const [showPlayersBar] = useGlobalState('showPlayersBar');

  if (!showPlayersBar) {
    return null;
  }

  return (
    <div className={clsx(styles.playersStatusBar, getAnimationClass('slideInRight'))}>
      <ul className={styles.playersStatusBarList}>
        {sortPlayers(players).map((player) => {
          return (
            <li
              className={styles.playersStatusBarPlayer}
              key={`players-status-bar-${player.id}`}
            >
              <Tooltip
                title={player.name}
                placement="left"
                trigger="hover"
              >
                <Badge
                  dot
                  color={player.ready ? 'green' : 'gray'}
                >
                  <PlayerAvatar
                    avatarId={player.avatarId}
                    alt={player.name}
                    size="small"
                    className={clsx(!player.ready && styles.playersStatusBarAvatarNotReady)}
                  />
                </Badge>
              </Tooltip>
              {player.ready && (
                <div className={styles.playersStatusBarReady}>
                  <div className={styles.playersStatusBarReadySpeech}>
                    <Translate
                      pt="Pronto!"
                      en="I'm ready!"
                    />
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
