// Ant Design Resources
import { Avatar } from 'antd';
import { RiseOutlined, TwitterOutlined } from '@ant-design/icons';
// Components
import clsx from 'clsx';
import { SpeechBubbleThumbsUpIcon } from 'icons/SpeechBubbleThumbsUpIcon';

type TopicProps = {
  topic: string;
  likes?: number;
  /**
   * Optional custom class name
   */
  className?: string;
};

export function Topic({ topic, likes, className = '' }: TopicProps) {
  return (
    <div className={clsx('p-trending-topic', className)}>
      <TwitterOutlined /> {topic} <RiseOutlined />{' '}
      {Boolean(likes) && (
        <span className="p-trending-topic__likes">
          <Avatar
            src={<SpeechBubbleThumbsUpIcon />}
            shape="square"
            size="large"
            className="p-trending-topic__icon-like"
          />{' '}
          {likes}
        </span>
      )}
    </div>
  );
}
