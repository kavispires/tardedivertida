import clsx from 'clsx';
import { motion } from 'motion/react';
// Ant Design Resources
import { Badge, Tooltip } from 'antd';
// Types
import type { GamePlayers } from 'types/game';
// Hooks
import { useGlobalState } from 'hooks/useGlobalState';
import { useSortedPlayers } from 'hooks/useSortedPlayers';
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
 * It uses the global state "showPlayersBar" to determine whether it should be shown or not, allowing it to be toggled on/off by the host or by players in their settings
 */
export function PlayersStatusBar({ players }: PlayersStatusBarProps) {
  const [showPlayersBar] = useGlobalState('showPlayersBar');

  if (!showPlayersBar) {
    return null;
  }

  return <InnerComponent players={players} />;
}

function InnerComponent({ players }: PlayersStatusBarProps) {
  const sortedPlayers = useSortedPlayers(players);

  return (
    <motion.div
      className={styles.playersStatusBar}
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      transition={{ type: 'tween', duration: 0.8 }}
    >
      <ul className={styles.playersStatusBarList}>
        {sortedPlayers.map((player) => {
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
    </motion.div>
  );
}
