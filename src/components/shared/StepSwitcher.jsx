import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
// Components
import { Loading } from '../loaders';

export function StepSwitcher({ children, step, conditions }) {
  if (!children[step]) {
    return <Loading />;
  }

  return (conditions?.[step] ?? true) && <Fragment>{children[step]}</Fragment>;
}

StepSwitcher.propTypes = {
  children: PropTypes.any.isRequired,
  step: PropTypes.number.isRequired,
  conditions: PropTypes.arrayOf(PropTypes.bool),
};

export function Step({ children, fullWidth = false, className }) {
  return <div className={clsx('step', fullWidth && 'step--full-width', className)}>{children}</div>;
}

Step.propTypes = {
  children: PropTypes.any.isRequired,
  fullWidth: PropTypes.bool,
  className: PropTypes.string,
};
