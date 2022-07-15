import clsx from 'clsx';
// Ant Design Resources
import { Button, ButtonProps } from 'antd';
// Hook and Utils
import { useTimer } from 'react-timer-hook';
import { inNSeconds } from 'utils/helpers';

interface TimedButtonProps extends ButtonProps {
  /**
   * Duration to call onExpire in seconds
   */
  duration?: number;
  /**
   * Function to be called when the time expires
   */
  onExpire?: GenericFunction;
  /**
   * Flag indicating if the timer should be hidden (this cancels the onExpire function)
   */
  hideTimer?: boolean;
}

/**
 * Button component that triggers a function when given duration is over
 */
export function TimedButton({
  duration = 10,
  children,
  onExpire,
  type,
  onClick,
  hideTimer = false,
  ...rest
}: TimedButtonProps) {
  const { minutes, seconds } = useTimer({
    expiryTimestamp: inNSeconds(duration),
    autoStart: true,
    onExpire: hideTimer ? undefined : onExpire,
  });

  const timeClass = 'timed-button__time';

  return (
    <Button {...rest} type={type} onClick={onClick ?? onExpire}>
      {children}
      {Boolean(children && !hideTimer) && ' '}
      {!hideTimer && (
        <span className={clsx(timeClass, `${timeClass}--${type}`)}>{minutes * 60 + seconds}</span>
      )}
    </Button>
  );
}
