import clsx from 'clsx';
import { Button, type ButtonProps } from 'antd';
import { useCountdown } from 'hooks/useCountdown';
import './TimedButton.scss';
// Hook and Utils

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
  className,
  ...rest
}: TimedButtonProps) {
  const { timeLeft } = useCountdown({
    duration,
    autoStart: true,
    onExpire,
    disabled: hideTimer,
  });

  const timeClass = 'timed-button__time';

  return (
    <Button className={clsx('timed-button', className)} {...rest} type={type} onClick={onClick ?? onExpire}>
      {children}
      {!hideTimer && <span className={clsx(timeClass, `${timeClass}--${type}`)}>{timeLeft}</span>}
    </Button>
  );
}
