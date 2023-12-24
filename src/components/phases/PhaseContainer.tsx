import { ReactNode, useRef } from 'react';
import clsx from 'clsx';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Components
import { LoadingPage } from 'components/loaders';
import { PageError } from 'components/errors';

type PhaseContainerProps = {
  info?: GameInfo;
  phase?: string;
  allowedPhase?: string;
  /**
   * The content of the component
   */
  children: ReactNode;
  /**
   * Optional custom class name
   */
  className?: string;
  fullScreen?: boolean;
  white?: boolean;
};

/**
 * Wrapping container around a game screen
 * @param props
 * @returns
 */
export function PhaseContainer({
  info,
  phase,
  allowedPhase = '',
  children,
  className = '',
  fullScreen = false,
  white = false,
}: PhaseContainerProps) {
  const { translate } = useLanguage();
  const screenRef = useRef<HTMLScriptElement>(null);

  if (!info?.gameName || allowedPhase !== phase) {
    return <LoadingPage />;
  }

  if (!phase) {
    return (
      <PageError description={translate('Estado do jogo não está correto', 'Game state is not correct')} />
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
