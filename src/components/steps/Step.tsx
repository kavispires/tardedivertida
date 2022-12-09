import clsx from 'clsx';
import { ReactNode } from 'react';

type StepProps = {
  /**
   * The content of the component
   */
  children: ReactNode;
  /**
   * Flag indicating if the step should be full width
   */
  fullWidth?: boolean;
  /**
   * Optional custom class name
   */
  className?: string;
  /**
   * Overlay PhaseAnnouncement
   */
  announcement?: JSX.Element;
};

export function Step({ children, announcement, fullWidth = false, className = '' }: StepProps) {
  return (
    <div className={clsx('step', fullWidth && 'step--full-width', className)}>
      {announcement}
      {children}
    </div>
  );
}
