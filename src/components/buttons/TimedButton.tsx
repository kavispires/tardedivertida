import clsx from 'clsx';
// Ant Design Resources
import { Button, type ButtonProps } from 'antd';
// Hooks
import { useCountdown } from 'hooks/useCountdown';
// Sass
import './TimedButton.scss';
// Hook and Utils

interface TimedButtonProps extends Omit<ButtonProps, 'onClick'> {
  /**
   * Duration to call onExpire in seconds
   */
  duration?: number;
  /**
   * Function to be called when the time expires
   */
  onExpire?: (timeLeft: number) => void;
  /**
   * The onclick function that will be called when the button is clicked
   */
  onClick?: (timeLeft: number) => void;
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
    onExpire: () => onExpire?.(0),
    disabled: hideTimer,
  });

  const timeClass = 'timed-button__time';

  return (
    <Button
      className={clsx('timed-button', className)}
      {...rest}
      type={type}
      onClick={() => onClick?.(timeLeft) ?? onExpire?.(timeLeft)}
    >
      {children}
      {!hideTimer && <span className={clsx(timeClass, `${timeClass}--${type}`)}>{timeLeft}</span>}
    </Button>
  );
}
