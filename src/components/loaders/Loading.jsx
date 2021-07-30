import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
// Design Resources
import { Space, Spin, Typography } from 'antd';

export function Loading({ message, margin }) {
  return (
    <Space className={clsx('loading', margin && 'loading--margin')}>
      <Spin />
      {Boolean(message) && <Typography.Text>{message}</Typography.Text>}
    </Space>
  );
}

Loading.propTypes = {
  margin: PropTypes.bool,
  message: PropTypes.string,
};

Loading.defaultProps = {
  margin: false,
};
