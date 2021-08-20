import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
// Design Resources
import { Space } from 'antd';

export function ButtonContainer({ children, wrap = false, className = '' }) {
  const baseClass = 'button-container';
  return (
    <Space className={clsx(baseClass, className)} wrap={wrap} data-testid="button-container">
      {children}
    </Space>
  );
}

ButtonContainer.propTypes = {
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.arrayOf(PropTypes.element)]).isRequired,
  className: PropTypes.string,
  wrap: PropTypes.bool,
};
