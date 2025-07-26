// Ant Design Resources
import { Avatar as AntAvatar } from 'antd';
// Types
import type { GamePlayers } from 'types/player';
// Components
import { Avatar } from 'components/avatars';
// Internal
import type { Bracket } from '../utils/type';

type BracketContenderVotesProps = {
  bracket: Bracket;
  players: GamePlayers;
};

export function BracketContenderVotes({ bracket, players }: BracketContenderVotesProps) {
  return (bracket.votes ?? []).length > 0 ? (
    <AntAvatar.Group className="w-contender-votes" max={{ count: 3 }} size="small">
      {bracket.votes?.map((vote) => (
        <Avatar
          size="small"
          id={players[vote].avatarId}
          alt={players[vote].name}
          key={`${bracket.id}-${bracket.votes}`}
        />
      ))}
    </AntAvatar.Group>
  ) : null;
}
