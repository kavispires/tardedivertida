import React, { memo } from 'react';
import PropTypes from 'prop-types';
// Design Resources
import { Typography } from 'antd';
import clsx from 'clsx';

export const Instruction = memo(function ({ children, white, className, contained }) {
  const baseClass = 'instruction';

  return (
    <Typography.Text
      className={clsx(
        baseClass,
        contained && `${baseClass}--contained`,
        white && `${baseClass}--white`,
        className
      )}
      data-testid="instruction"
    >
      {children}
    </Typography.Text>
  );
});

Instruction.propTypes = {
  children: PropTypes.any.isRequired,
  white: PropTypes.bool,
  className: PropTypes.string,
};
