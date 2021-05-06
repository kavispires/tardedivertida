import React, { memo } from 'react';
import PropTypes from 'prop-types';
// Design Resources
import { Typography } from 'antd';
import clsx from 'clsx';

function Instruction({ children, white, className }) {
  return (
    <Typography.Text className={clsx('instruction', white && 'instruction--white', className)}>
      {children}
    </Typography.Text>
  );
}

Instruction.propTypes = {
  children: PropTypes.any.isRequired,
  white: PropTypes.bool,
  className: PropTypes.string,
};

export default memo(Instruction);
