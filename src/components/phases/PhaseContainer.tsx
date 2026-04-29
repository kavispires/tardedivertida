import clsx from 'clsx';
import { type ReactNode, useRef } from 'react';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Components
import { PageError } from 'components/errors/PageError';
import { LoadingPage } from 'components/loaders/LoadingPage';
// Sass
import styles from './PhaseContainer.module.scss';

type PhaseContainerProps = {
  /**
   * The current phase that must match the allowed phase
   */
  phase?: string;
  /**
   * The allowed phase
   */
  allowedPhase?: string;
  /**
   * The content of the component
   */
  children: ReactNode;
  /**
   * Optional custom class name
   */
  className?: string;
  /**
   * If the container should take the full screen
   */
  fullScreen?: boolean;
};

/**
 * Wrapper container component around a game screen that validates phase and provides error handling
 */
export function PhaseContainer({
  phase,
  allowedPhase = '',
  children,
  className = '',
  fullScreen = false,
}: PhaseContainerProps) {
  const { translate } = useLanguage();
  const screenRef = useRef<HTMLScriptElement>(null);

  if (allowedPhase !== phase) {
    return <LoadingPage />;
  }

  if (!phase) {
    return (
      <PageError description={translate('Estado do jogo não está correto', 'Game state is not correct')} />
    );
  }

  return (
    <main
      className={clsx(styles.phaseContainer, fullScreen && styles.phaseContainerFullScreen, className)}
      id="screen"
      ref={screenRef}
    >
      {children}
    </main>
  );
}
