import clsx from 'clsx';
// Ant Design Resources
import { Button, ButtonProps } from 'antd';
// Hook and Utils
import { useTimer } from 'react-timer-hook';
import { inNSeconds } from 'utils/helpers';

interface TimedButtonProps extends ButtonProps {
  duration?: number;
  onExpire?: GenericFunction;
  showTimer?: boolean;
}

export function TimedButton({
  duration = 10,
  children,
  onExpire,
  showTimer = true,
  type,
  onClick,
  ...props
}: TimedButtonProps) {
  const { minutes, seconds } = useTimer({
    expiryTimestamp: inNSeconds(duration),
    autoStart: true,
    onExpire: showTimer ? onExpire : undefined,
  });

  const timeClass = 'timed-button__time';

  return (
    <Button {...props} type={type} onClick={onClick ?? onExpire}>
      {children}
      {Boolean(children) && ' '}
      {showTimer && (
        <span className={clsx(timeClass, `${timeClass}--${type}`)}>{minutes * 60 + seconds}</span>
      )}
    </Button>
  );
}
