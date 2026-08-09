import clsx from 'clsx';
import { type ReactNode, useRef } from 'react';
// Hooks
import { useLanguage } from '@hooks/useLanguage';
// Components
import { PageError } from '@components/errors/PageError';
import { LoadingPage } from '@components/loaders/LoadingPage';
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
  /**
   * Indicates if the container has all the required data
   */
  hasRequiredData?: boolean;
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
  hasRequiredData = true,
}: PhaseContainerProps) {
  const { translate } = useLanguage();
  const screenRef = useRef<HTMLScriptElement>(null);

  if (allowedPhase !== phase) {
    return <LoadingPage />;
  }

  if (!hasRequiredData) {
    return <LoadingPage message={{ pt: 'Aguardando dados necessários', en: 'Waiting for required data' }} />;
  }

  if (!phase) {
    return (
      <PageError
        description={translate({ pt: 'Estado do jogo não está correto', en: 'Game state is not correct' })}
      />
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
