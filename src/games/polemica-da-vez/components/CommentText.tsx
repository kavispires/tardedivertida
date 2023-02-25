import clsx from 'clsx';
import { IconAvatar } from 'components/avatars/IconAvatar';
import { SpeechBubbleThumbsDownIcon } from 'icons/SpeechBubbleThumbsDownIcon';
import { SpeechBubbleThumbsUpIcon } from 'icons/SpeechBubbleThumbsUpIcon';
import { Translate } from 'components/language';
import { StarPoints } from 'components/points';
// Components

type CommentTextProps = {
  reaction: boolean;
  likes: boolean;
  playerId: PlayerId;
  points: number;
};

export function CommentText({ reaction, likes, playerId, points }: CommentTextProps) {
  return (
    <span>
      {reaction ? (
        <>
          <IconAvatar icon={<SpeechBubbleThumbsUpIcon />} shape="square" className="p-like-icon" size={20} />{' '}
          <Translate pt="Curto e " en="I like it and" />
        </>
      ) : (
        <>
          <IconAvatar
            icon={<SpeechBubbleThumbsDownIcon />}
            shape="square"
            className="p-like-icon"
            size={20}
          />{' '}
          <Translate pt="Não curto, mas" en="I dislike it but" />
        </>
      )}

      <Translate pt={<>eu acho que </>} en={<>I think </>} />

      <span
        className={clsx(
          points === 3 && 'p-tweet-comment__correct',
          points === 1 && 'p-tweet-comment__almost',
          points === 0 && 'p-tweet-comment__incorrect'
        )}
      >
        <Translate pt={<>{likes} jogadores</>} en={<>{likes} players</>} />
      </span>

      <Translate pt={<> curtem.</>} en={<> do like it.</>} />
      <br />
      <span className="p-tweet-comment__points">
        <StarPoints keyPrefix={playerId} quantity={points} />
      </span>
    </span>
  );
}
