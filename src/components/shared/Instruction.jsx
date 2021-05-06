import React from 'react';
import PropTypes from 'prop-types';
// Design Resources
import { Typography } from 'antd';
import clsx from 'clsx';

function Instruction({ children, className }) {
  return <Typography.Text className={clsx('instruction', className)}>{children}</Typography.Text>;
}

Instruction.propTypes = {
  children: PropTypes.any.isRequired,
  className: PropTypes.string,
};

export default Instruction;
