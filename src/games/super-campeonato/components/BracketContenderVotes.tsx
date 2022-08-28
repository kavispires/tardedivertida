// Ant Design Resources
import { Avatar as AntAvatar } from 'antd';
// Components
import { Avatar } from 'components/avatars';

type BracketContenderVotesProps = {
  bracket: WBracket;
  players: GamePlayers;
};

export function BracketContenderVotes({ bracket, players }: BracketContenderVotesProps) {
  return (bracket.votes ?? []).length > 0 ? (
    <AntAvatar.Group className="w-contender-votes" maxCount={3} size="small">
      {bracket.votes?.map((vote) => (
        <Avatar
          size="small"
          id={players[vote].avatarId}
          alt={players[vote].name}
          key={`${bracket.id}-${bracket.votes}`}
        />
      ))}
    </AntAvatar.Group>
  ) : (
    <></>
  );
}
