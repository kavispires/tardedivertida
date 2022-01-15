import clsx from 'clsx';
// Design Resources
import { Button, ButtonProps } from 'antd';
// Hook and Utils
import { useTimer } from 'react-timer-hook';
import { inNSeconds } from '../../utils/helpers';

interface TimedButtonProps extends ButtonProps {
  duration?: number;
  label: any;
  onExpire?: GenericFunction;
  showTimer?: boolean;
}

export function TimedButton({
  duration = 10,
  label,
  onExpire,
  showTimer = true,
  type,
  ...props
}: TimedButtonProps) {
  const { minutes, seconds } = useTimer({
    expiryTimestamp: inNSeconds(duration),
    autoStart: true,
    onExpire: showTimer ? onExpire : undefined,
  });

  const timeClass = 'timed-button__time';

  return (
    <Button {...props} type={type}>
      {label}
      {Boolean(label) && ' '}
      {showTimer && (
        <span className={clsx(timeClass, `${timeClass}--${type}`)}>{minutes * 60 + seconds}</span>
      )}
    </Button>
  );
}
