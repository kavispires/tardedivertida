import React from 'react';
import PropTypes from 'prop-types';
// Design Resources
import { Button } from 'antd';
import { RocketFilled } from '@ant-design/icons';
// State
import { useLoading } from '../../hooks';

export function AdminButton({ action, label, ...props }) {
  const [isLoading] = useLoading();
  return (
    <Button icon={<RocketFilled />} danger type="primary" onClick={action} disabled={isLoading} {...props}>
      {label}
    </Button>
  );
}

AdminButton.propTypes = {
  action: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
};
