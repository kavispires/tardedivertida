import React, { memo } from 'react';
import PropTypes from 'prop-types';
// Design Resources
import { Typography } from 'antd';
import clsx from 'clsx';

function Title({ children, white, icon, className }) {
  return (
    <Typography.Title className={clsx('title', white && 'title--white', className)}>
      {Boolean(icon) && icon}
      {children}
    </Typography.Title>
  );
}

Title.propTypes = {
  children: PropTypes.any.isRequired,
  white: PropTypes.bool,
  icon: PropTypes.element,
  className: PropTypes.string,
};

export default memo(Title);
