import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Loading from '../loaders/Loading';
import clsx from 'clsx';

function StepSwitcher({ children, step, conditions }) {
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

export default StepSwitcher;

export function Step({ children, className }) {
  return <div className={clsx('step', className)}>{children}</div>;
}

StepSwitcher.propTypes = {
  children: PropTypes.any.isRequired,
  className: PropTypes.string,
};
