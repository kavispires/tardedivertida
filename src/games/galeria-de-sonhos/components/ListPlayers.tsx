// Components
import { AvatarName } from 'components/avatars';

type ListPlayersProps = {
  listPlayers: GamePlayer[];
  className: string;
};

export function ListPlayers({ listPlayers, className }: ListPlayersProps) {
  return (
    <ul className={className}>
      {listPlayers.map((player) => (
        <li key={`${className}-${player.id}`}>
          <AvatarName player={player} addressUser />
        </li>
      ))}
    </ul>
  );
}
