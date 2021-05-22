import React, { memo } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
// Design Resources
import { Button, Space } from 'antd';
import { RocketFilled } from '@ant-design/icons';
// State
import { useLoading, useGlobalState } from '../../hooks';

function AdminOnly({ children, className = '' }) {
  const [isAdmin] = useGlobalState('isAdmin');

  if (!isAdmin) return <span></span>;

  return <Space className={clsx('admin-only-container', className)}>{children}</Space>;
}

AdminOnly.propTypes = {
  children: PropTypes.element.isRequired,
  className: PropTypes.string,
};

export default memo(AdminOnly);

export function AdminButton({ action, label }) {
  const [isLoading] = useLoading();
  return (
    <Button icon={<RocketFilled />} danger type="primary" onClick={action} disabled={isLoading}>
      {label}
    </Button>
  );
}

export function AdminOnlyButton({ action, label }) {
  return (
    <AdminOnly>
      <AdminButton action={action} label={label} />
    </AdminOnly>
  );
}
