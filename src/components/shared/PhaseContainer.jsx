import React, { useEffect, useRef } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
// Hooks
import { useGlobalState } from '../../hooks';
// Utils
import { isDevEnv } from '../../utils';
// Components
import { LoadingPage } from '../loaders';
import { PageError } from '../errors/PageError';

/**
 * Wrapping container around a game screen
 * @param {*} props
 * @returns
 */
export function PhaseContainer({ info, phase, allowedPhase, children, className, fullScreen, white }) {
  const screenRef = useRef(null);
  const [username] = useGlobalState('username');
  const [, setScreenSize] = useGlobalState('screenSize');

  useEffect(() => {
    if (screenRef.current) {
      let height = screenRef.current.offsetHeight;
      let width = screenRef.current.offsetWidth;
      setScreenSize([width, height]);
    }
  }, [screenRef, setScreenSize]);

  if (!info?.gameName || allowedPhase !== phase) {
    return <LoadingPage />;
  }

  if (!phase) {
    return <PageError message="Algo errado não está certo" description="Estado do jogo não está correto" />;
  }

  const baseClass = 'phase-container';

  return (
    <main
      className={clsx(
        baseClass,
        fullScreen && `${baseClass}--full-screen`,
        white && `${baseClass}--white`,
        className
      )}
      id="screen"
      ref={screenRef}
    >
      {isDevEnv && <span className={`${baseClass}__dev-player-name`}>{username}</span>}
      <span className={`${baseClass}__title`}>{info.title}</span>
      {children}
    </main>
  );
}

PhaseContainer.propTypes = {
  allowedPhase: PropTypes.string,
  children: PropTypes.any.isRequired,
  className: PropTypes.string,
  fullScreen: PropTypes.bool,
  info: PropTypes.shape({
    gameName: PropTypes.string,
    title: PropTypes.string,
  }),
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
