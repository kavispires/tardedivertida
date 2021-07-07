import React from 'react';
import PropTypes from 'prop-types';
// Components
import { AdminOnly, AdminButton } from './index';

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
