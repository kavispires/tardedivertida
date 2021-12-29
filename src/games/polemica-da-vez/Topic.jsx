import PropTypes from 'prop-types';
import { LikeFilled, RiseOutlined, TwitterOutlined } from '@ant-design/icons';

export function Topic({ topic, likes }) {
  return (
    <div className="p-trending-topic">
      <TwitterOutlined /> {topic} <RiseOutlined />{' '}
      {Boolean(likes) && (
        <span className="p-trending-topic__likes">
          {likes} <LikeFilled className="p-icon-like" />
        </span>
      )}
    </div>
  );
}

Topic.propTypes = {
  topic: PropTypes.string.isRequired,
};
