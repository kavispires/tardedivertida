import clsx from 'clsx';
// Components
import { Loading } from '../loaders';

type StepSwitcherProps = {
  children: any;
  step: number;
  conditions?: boolean[];
};

export function StepSwitcher({ children, step, conditions }: StepSwitcherProps) {
  if (!children[step]) {
    return <Loading />;
  }

  if (conditions?.[step] ?? true) {
    return children[step];
  }

  return <div></div>;
}

type StepProps = {
  children: any;
  fullWidth?: boolean;
  className?: string;
};

export function Step({ children, fullWidth = false, className }: StepProps) {
  return <div className={clsx('step', fullWidth && 'step--full-width', className)}>{children}</div>;
}
