import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

export function View({ visibleIf = false, children }) {
  return visibleIf && <Fragment>{children}</Fragment>;
}

View.propTypes = {
  children: PropTypes.any.isRequired,
  visibleIf: PropTypes.bool,
};
