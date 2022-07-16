import clsx from 'clsx';
import { ReactNode } from 'react';

type StepProps = {
  /**
   * The content of the component
   */
  children: ReactNode;
  fullWidth?: boolean;
  /**
   * Optional custom class name
   */
  className?: string;
};

export function Step({ children, fullWidth = false, className }: StepProps) {
  return <div className={clsx('step', fullWidth && 'step--full-width', className)}>{children}</div>;
}
