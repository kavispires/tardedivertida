import moment from 'moment';
// Types
import type { GamePlayer } from 'types/player';
// Components
import { PlayerAvatar } from 'components/avatars';
// Internal
import { CommentText } from './CommentText';

type TweetCommentProps = {
  player: GamePlayer;
  totalLikes: number;
};

export function TweetComment({ player, totalLikes }: TweetCommentProps) {
  const isCorrect = player.likesGuess === totalLikes;
  const isAlmost = [totalLikes - 1, totalLikes + 1].includes(player.likesGuess);
  const points = isCorrect ? 3 : isAlmost ? 1 : 0;

  return (
    <div className="p-tweet-comment">
      <div className="p-tweet-comment__avatar">
        <PlayerAvatar avatarId={player.avatarId} />
      </div>
      <div className="p-tweet-comment__content">
        <div className="p-tweet-comment__author">
          <span className="p-tweet-comment__author-name">{player.name}</span>
          <span className="p-tweet-comment__author-date">{moment(player.updatedAt).fromNow()}</span>
        </div>
        <CommentText
          reaction={player.reaction}
          likes={player.likesGuess}
          points={points}
          playerId={player.id}
        />
      </div>
    </div>
  );
}
