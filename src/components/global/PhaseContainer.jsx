import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
// Design Resources
import { Layout } from 'antd';
// Components
import LoadingPage from '../loaders/LoadingPage';

function PhaseContainer({ info, phase = '', allowedPhase = '', children, className }) {
  if (!info?.gameName || allowedPhase !== phase) {
    return <LoadingPage />;
  }

  return <Layout.Content className={clsx('phase-container', className)}>{children}</Layout.Content>;
}

PhaseContainer.propTypes = {
  allowedPhase: PropTypes.string,
  children: PropTypes.element.isRequired,
  className: PropTypes.string,
  info: PropTypes.object,
  phase: PropTypes.string,
};

export default PhaseContainer;
