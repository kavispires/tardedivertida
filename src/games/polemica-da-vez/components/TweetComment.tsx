import moment from 'moment';
// Ant Design Resources
import { Comment } from '@ant-design/compatible';
// Components
import { Avatar } from 'components/avatars';
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
    <Comment
      author={player.name}
      avatar={<Avatar id={player.avatarId} />}
      content={
        <CommentText
          reaction={player.reaction}
          likes={player.likesGuess}
          points={points}
          playerId={player.id}
        />
      }
      datetime={moment(player.updatedAt).fromNow()}
      className="p-tweet-comment"
    />
  );
}
