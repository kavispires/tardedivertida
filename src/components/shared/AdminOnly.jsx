import React, { memo } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
// Design Resources
import { Button, Space } from 'antd';
import { RocketFilled } from '@ant-design/icons';
// State
import { useLoading, useGlobalState } from '../../hooks';

export const AdminOnly = memo(function ({ children, className = '' }) {
  const [isAdmin] = useGlobalState('isAdmin');

  if (!isAdmin) return <span></span>;

  return <Space className={clsx('admin-only-container', className)}>{children}</Space>;
});

AdminOnly.propTypes = {
  children: PropTypes.element.isRequired,
  className: PropTypes.string,
};

export function AdminButton({ action, label }) {
  const [isLoading] = useLoading();
  return (
    <Button icon={<RocketFilled />} danger type="primary" onClick={action} disabled={isLoading}>
      {label}
    </Button>
  );
}

AdminButton.propTypes = {
  action: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
};

export function AdminOnlyButton({ action, label }) {
  return (
    <AdminOnly>
      <AdminButton action={action} label={label} />
    </AdminOnly>
  );
}

AdminOnlyButton.propTypes = {
  action: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
};
