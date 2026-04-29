import clsx from 'clsx';
// Ant Design Resources
import { Button, type ButtonProps } from 'antd';
// Hooks
import { useCountdown } from 'hooks/useCountdown';
// Sass
import styles from './TimedButton.module.scss';

type TimedButtonProps = Omit<ButtonProps, 'onClick'> & {
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
};

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

  const timeTypeClass = type ? styles[type as keyof typeof styles] : undefined;

  return (
    <Button
      className={clsx(styles.timedButton, className)}
      {...rest}
      type={type}
      onClick={() => (onClick ? onClick?.(timeLeft) : onExpire?.(timeLeft))}
    >
      {children}
      {!hideTimer && <span className={clsx(styles.time, timeTypeClass)}>{timeLeft}</span>}
    </Button>
  );
}
