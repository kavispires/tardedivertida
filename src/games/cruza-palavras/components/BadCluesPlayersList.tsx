// Types
import type { GamePlayer } from 'types/player';
// Components
import { AvatarName } from 'components/avatars';

type BadCluesPlayersListProps = {
  badCluesPlayersList: GamePlayer[];
};

export function BadCluesPlayersList({ badCluesPlayersList }: BadCluesPlayersListProps) {
  return (
    <span>
      {badCluesPlayersList.map((player, index) => (
        <span key={`bad-clue-${player.id}-${index}`}>
          <AvatarName player={player} key={`bad-clue-${player.id}`} size="small" />
          {badCluesPlayersList.length > 0 && index < badCluesPlayersList.length - 1 ? ', ' : ''}
        </span>
      ))}
    </span>
  );
}
