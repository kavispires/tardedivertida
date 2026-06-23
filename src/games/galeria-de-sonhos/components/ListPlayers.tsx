// Types
import type { GamePlayer } from 'types/game';
// Components
import { PlayerAvatarName } from '@components/player/PlayerAvatarName';

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
