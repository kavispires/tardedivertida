import clsx from 'clsx';
import { ReactNode } from 'react';

type StepProps = {
  /**
   * Overlay PhaseAnnouncement
   */
  announcement?: JSX.Element;
  /**
   * The content of the component
   */
  children: ReactNode;

  /**
   * Optional custom class name
   */
  className?: string;
  /**
   * Flag indicating if the step should be full width
   */
  fullWidth?: boolean;
  /**
   * Flag indicating if the step should be full height
   */
  fullHeight?: boolean;
};

export function Step({
  children,
  announcement,
  fullWidth = false,
  fullHeight = false,
  className = '',
}: StepProps) {
  return (
    <div
      className={clsx('step', fullWidth && 'step--full-width', fullHeight && 'step--full-height', className)}
    >
      {announcement}
      {children}
    </div>
  );
}
