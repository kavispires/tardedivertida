// Design Resources
import { Avatar } from 'antd';
import { RiseOutlined, TwitterOutlined } from '@ant-design/icons';
// Components
import { Icons } from '../../components';
import clsx from 'clsx';

type TopicProps = {
  topic: string;
  likes?: number;
  className?: string;
};

export function Topic({ topic, likes, className = '' }: TopicProps) {
  return (
    <div className={clsx('p-trending-topic', className)}>
      <TwitterOutlined /> {topic} <RiseOutlined />{' '}
      {Boolean(likes) && (
        <span className="p-trending-topic__likes">
          <Avatar
            src={<Icons.SpeechBubbleThumbsUp />}
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
