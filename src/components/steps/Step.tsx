import clsx from 'clsx';
import { type ReactNode, forwardRef } from 'react';
// Hooks
import { useTemporarilyHidePlayersBar } from '@hooks/useTemporarilyHidePlayersBar';
// Sass
import styles from './Step.module.scss';

export type StepProps = {
  /**
   * Overlay PhaseAnnouncement
   */
  announcement?: ReactNode;
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
  /**
   * Flag to hide the players bar during this step
   */
  hidePlayersBar?: boolean;
};

/**
 * Base step container component with announcement banner and optional full-width layout
 */
export const Step = forwardRef<HTMLDivElement, StepProps>(
  (
    {
      children,
      announcement,
      fullWidth = false,
      fullHeight = false,
      className = '',
      hidePlayersBar = false,
    }: StepProps,
    ref,
  ) => {
    useTemporarilyHidePlayersBar(!hidePlayersBar);

    return (
      <div
        ref={ref}
        className={clsx(
          styles.step,
          fullWidth && styles.stepFullWidth,
          fullHeight && styles.stepFullHeight,
          className,
        )}
      >
        {announcement}
        {children}
      </div>
    );
  },
);
