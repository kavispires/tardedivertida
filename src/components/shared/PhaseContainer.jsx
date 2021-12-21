import React, { useEffect, useRef } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
// Hooks
import { useGlobalState, useLanguage } from '../../hooks';
// Components
import { LoadingPage } from '../loaders';
import { PageError } from '../errors/PageError';
import { translate } from './Translate';

/**
 * Wrapping container around a game screen
 * @param {*} props
 * @returns
 */
export function PhaseContainer({ info, phase, allowedPhase, children, className, fullScreen, white }) {
  const language = useLanguage();
  const screenRef = useRef(null);
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
    return (
      <PageError
        description={translate('Estado do jogo não está correto', 'Game state is not correct', language)}
      />
    );
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
    title: PropTypes.shape({
      pt: PropTypes.string,
      en: PropTypes.string,
    }),
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
