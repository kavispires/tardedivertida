import clsx from 'clsx';

type StepProps = {
  children: any;
  fullWidth?: boolean;
  className?: string;
};

export function Step({ children, fullWidth = false, className }: StepProps) {
  return <div className={clsx('step', fullWidth && 'step--full-width', className)}>{children}</div>;
}
