import clsx from 'clsx';
import { type ReactNode, useRef } from 'react';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Components
import { PageError } from 'components/errors';
import { LoadingPage } from 'components/loaders';
import { useGameAppearance } from 'components/session/GameInfoContext';
// Sass
import './PhaseContainer.scss';

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
 * Wrapping container around a game screen
 * @param props
 * @returns
 */
export function PhaseContainer({
  phase,
  allowedPhase = '',
  children,
  className = '',
  fullScreen = false,
}: PhaseContainerProps) {
  const appearance = useGameAppearance();
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

  const baseClass = 'phase-container';
  const backgroundColorOverlay = appearance?.backgroundColor;

  return (
    <main
      className={clsx(baseClass, fullScreen && `${baseClass}--full-screen`, className)}
      id="screen"
      ref={screenRef}
      style={backgroundColorOverlay ? { backgroundColor: backgroundColorOverlay } : {}}
    >
      {children}
    </main>
  );
}
