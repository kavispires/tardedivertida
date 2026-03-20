// Ant Design Resources
import { CheckCircleFilled, MinusCircleFilled } from '@ant-design/icons';
// Types
import type { GamePlayers } from 'types/game';
// Sass
import styles from './PlayersReadyState.module.scss';
// Styles

type PlayersReadyStateProps = {
  /**
   * The game players
   */
  players: GamePlayers;
};

type PlayerStatus = {
  readyPlayers: string[];
  pendingPlayers: string[];
};

export function PlayersReadyState({ players }: PlayersReadyStateProps) {
  const { readyPlayers, pendingPlayers }: PlayerStatus = Object.values(players).reduce(
    (acc: PlayerStatus, player) => {
      if (player.ready) {
        acc.readyPlayers.push(player.name);
      } else {
        acc.pendingPlayers.push(player.name);
      }

      return acc;
    },
    {
      readyPlayers: [],
      pendingPlayers: [],
    },
  );

  return (
    <li className={styles.adminPlayersReadyState}>
      <h3>Players Ready State</h3>
      <div className={styles.entry}>
        <CheckCircleFilled
          style={{ color: 'green' }}
          title="Ready:"
        />
        <ul className={styles.list}>
          {readyPlayers.map((playerName) => (
            <li
              key={`admin-player-${playerName}`}
              className={styles.item}
            >
              {playerName}
            </li>
          ))}
        </ul>
      </div>
      <div className={styles.entry}>
        <MinusCircleFilled
          style={{ color: 'orange' }}
          title="Ready:"
        />
        <ul className={styles.list}>
          {pendingPlayers.map((playerName) => (
            <li
              key={`admin-player-${playerName}`}
              className={styles.item}
            >
              {playerName}
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
}
