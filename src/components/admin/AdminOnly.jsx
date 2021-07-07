import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
// Design Resources
import { Space } from 'antd';
// State
import { useGlobalState } from '../../hooks';

export const AdminOnly = ({ children, className = '' }) => {
  const [isAdmin] = useGlobalState('isAdmin');

  if (!isAdmin) return <span></span>;

  return <Space className={clsx('admin-only-container', className)}>{children}</Space>;
};

AdminOnly.propTypes = {
  children: PropTypes.element.isRequired,
  className: PropTypes.string,
};
