import React, { memo } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
// Design Resources
import { Layout } from 'antd';
// Components
import LoadingPage from '../loaders/LoadingPage';
import PageError from '../errors/PageError';

/**
 * Wrapping container around a game screen
 * @param {*} props
 * @returns
 */
function PhaseContainer({ info, phase, allowedPhase, children, className, fullScreen, white }) {
  if (!info?.gameName || allowedPhase !== phase) {
    return <LoadingPage />;
  }

  if (!phase) {
    return <PageError message="Algo errado não está certo" description="Estado do jogo não está correto" />;
  }

  const baseClass = 'phase-container';

  return (
    <Layout.Content
      className={clsx(
        baseClass,
        fullScreen && `${baseClass}--full-screen`,
        white && `${baseClass}--white`,
        className
      )}
    >
      <span className={`${baseClass}__title`}>{info.title}</span>
      {children}
    </Layout.Content>
  );
}

PhaseContainer.propTypes = {
  children: PropTypes.any.isRequired,
  allowedPhase: PropTypes.string,
  className: PropTypes.string,
  fullScreen: PropTypes.bool,
  info: PropTypes.object,
  phase: PropTypes.string,
  white: PropTypes.bool,
};

PhaseContainer.defaultProps = {
  allowedPhase: '',
  className: '',
  fullScreen: false,
  phase: '',
  white: false,
};

export default memo(PhaseContainer);
