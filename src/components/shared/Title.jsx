import React, { memo } from 'react';
import PropTypes from 'prop-types';
// Design Resources
import { Typography } from 'antd';
import clsx from 'clsx';

export const Title = memo(function ({ children, white, icon, className, level }) {
  return (
    <Typography.Title level={level} className={clsx('title', white && 'title--white', className)}>
      {Boolean(icon) && icon}
      {children}
    </Typography.Title>
  );
});

Title.propTypes = {
  children: PropTypes.any.isRequired,
  white: PropTypes.bool,
  icon: PropTypes.element,
  className: PropTypes.string,
  level: PropTypes.number,
};

Title.defaultProps = {
  className: '',
  level: 1,
};
