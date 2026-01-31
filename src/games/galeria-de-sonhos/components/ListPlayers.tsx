// Types
import type { GamePlayer } from 'types/player';
// Components
import { PlayerAvatarName } from 'components/player';

type ListPlayersProps = {
  listPlayers: GamePlayer[];
  className: string;
};

export function ListPlayers({ listPlayers, className }: ListPlayersProps) {
  return (
    <ul className={className}>
      {listPlayers.map((player) => (
        <li key={`${className}-${player.id}`}>
          <PlayerAvatarName
            player={player}
            addressUser
          />
        </li>
      ))}
    </ul>
  );
}
