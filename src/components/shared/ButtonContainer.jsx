import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
// Design Resources
import { Space } from 'antd';

function ButtonContainer({ children, className = '' }) {
  return <Space className={clsx('button-container', className)}>{children}</Space>;
}

ButtonContainer.propTypes = {
  children: PropTypes.element.isRequired,
  className: PropTypes.string,
};

export default ButtonContainer;
