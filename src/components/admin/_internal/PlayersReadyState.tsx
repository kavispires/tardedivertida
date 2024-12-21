// Ant Design Resources
import { CheckCircleFilled, MinusCircleFilled } from '@ant-design/icons';
// Types
import type { GamePlayers } from 'types/player';
// Sass
import './PlayersReadyState.scss';

type PlayersReadyStateProps = {
  /**
   * The game players
   */
  players: GamePlayers;
};

type PlayerStatus = {
  readyPlayers: PlayerName[];
  pendingPlayers: PlayerName[];
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
    <li className="admin-players-ready-state">
      <h3>Players Ready State</h3>
      <div className="admin-players-ready-state__entry">
        <CheckCircleFilled style={{ color: 'green' }} title="Ready:" />
        <ul className="admin-players-ready-state__list">
          {readyPlayers.map((playerName) => (
            <li key={`admin-player-${playerName}`} className="admin-players-ready-state__item">
              {playerName}
            </li>
          ))}
        </ul>
      </div>
      <div className="admin-players-ready-state__entry">
        <MinusCircleFilled style={{ color: 'orange' }} title="Ready:" />
        <ul className="admin-players-ready-state__list">
          {pendingPlayers.map((playerName) => (
            <li key={`admin-player-${playerName}`} className="admin-players-ready-state__item">
              {playerName}
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
}
