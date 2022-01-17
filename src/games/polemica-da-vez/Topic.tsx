// Design Resources
import { Avatar } from 'antd';
import { RiseOutlined, TwitterOutlined } from '@ant-design/icons';
// Components
import { Icons } from '../../components';

type TopicProps = {
  topic: string;
  likes?: number;
};

export function Topic({ topic, likes }: TopicProps) {
  return (
    <div className="p-trending-topic">
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
