import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

export function View({ children }) {
  return <Fragment>{children}</Fragment>;
}

export function ViewIf({ isVisible = false, children }) {
  return isVisible && <Fragment>{children}</Fragment>;
}

export function ViewSwitch({ cases, children }) {
  if (cases.length > 5) {
    throw Error('ViewSwitch only supports up to 5 cases');
  }

  if (cases[0] && children[0]) {
    return children[0];
  }

  if (cases[1] && children[1]) {
    return children[1];
  }

  if (cases[2] && children[2]) {
    return children[2];
  }

  if (cases[3] && children[3]) {
    return children[3];
  }

  if (cases[4] && children[4]) {
    return children[4];
  }
  console.warn('Rendering all children in the ViewSwitch');
  return children;
}

View.propTypes = {
  children: PropTypes.any.isRequired,
};

ViewIf.propTypes = {
  children: PropTypes.any.isRequired,
  isVisible: PropTypes.bool,
};

ViewIf.propTypes = {
  children: PropTypes.any.isRequired,
  cases: PropTypes.arrayOf(PropTypes.bool),
};
