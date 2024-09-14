import clsx from 'clsx';
// Ant Design Resources
import { Button, ButtonProps } from 'antd';
// Hooks
import { useCountdown } from 'hooks/useCountdown';
// Sass
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
    <Button {...rest} type={type} onClick={onClick ?? onExpire}>
      {children}
      {Boolean(children && !hideTimer) && ' '}
      {!hideTimer && <span className={clsx(timeClass, `${timeClass}--${type}`)}>{timeLeft}</span>}
    </Button>
  );
}
