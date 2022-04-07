import clsx from 'clsx';
import { AvatarIcon } from 'components/avatars';
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
          <Translate pt="Curto" en="I like it" />{' '}
          <AvatarIcon type="speech-bubble-thumbs-up" shape="square" className="p-like-icon" size={20} />{' '}
          <Translate pt=" e " en=" and " />
        </>
      ) : (
        <>
          <Translate pt="Não curto" en="I dislike it" />{' '}
          <AvatarIcon type="speech-bubble-thumbs-down" shape="square" className="p-like-icon" size={20} />{' '}
          <Translate pt=", mas " en=" but " />
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
