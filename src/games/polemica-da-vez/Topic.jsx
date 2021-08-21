import PropTypes from 'prop-types';
import { RiseOutlined, TwitterOutlined } from '@ant-design/icons';
import React from 'react';

export function Topic({ topic }) {
  return (
    <div className="p-trending-topic">
      <TwitterOutlined /> {topic} <RiseOutlined />
    </div>
  );
}

Topic.propTypes = {
  topic: PropTypes.string.isRequired,
};
