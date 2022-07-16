import { ReactNode, useEffect, useRef } from 'react';
import clsx from 'clsx';
// Hooks
import { useGlobalState, useLanguage } from 'hooks';
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
