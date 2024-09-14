import clsx from 'clsx';
import { ReactNode, forwardRef } from 'react';

export type StepProps = {
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

export const Step = forwardRef<HTMLDivElement, StepProps>(
  ({ children, announcement, fullWidth = false, fullHeight = false, className = '' }: StepProps, ref) => {
    return (
      <div
        ref={ref}
        className={clsx(
          'step',
          fullWidth && 'step--full-width',
          fullHeight && 'step--full-height',
          className
        )}
      >
        {announcement}
        {children}
      </div>
    );
  }
);
