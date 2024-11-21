import clsx from 'clsx';
// Ant Design Resources
import { RiseOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';
// Icons
import { SpeechBubbleThumbsUpIcon } from 'icons/SpeechBubbleThumbsUpIcon';
import { TwitterIcon } from 'icons/TwitterIcon';
// Components
import { IconAvatar } from 'components/avatars';

type TweetProps = {
  tweet: string;
  likes?: number;
  /**
   * Optional custom class name
   */
  className?: string;
};

export function Tweet({ tweet, likes, className = '' }: TweetProps) {
  return (
    <div className={clsx('p-trending-tweet', className)}>
      <IconAvatar icon={<TwitterIcon />} /> {tweet} <RiseOutlined />{' '}
      {Boolean(likes) && (
        <span className="p-trending-tweet__likes">
          <Avatar
            src={<SpeechBubbleThumbsUpIcon />}
            shape="square"
            size="large"
            className="p-trending-tweet__icon-like"
          />{' '}
          {likes}
        </span>
      )}
    </div>
  );
}
