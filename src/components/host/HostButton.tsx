import clsx from 'clsx';
import type { ComponentProps } from 'react';
// Ant Design Resources
import { RocketOutlined } from '@ant-design/icons';
// Hooks
import { useCountdown } from '@hooks/useCountdown';
// Components
import { SendButton } from '@components/buttons/SendButton';
// Sass
import styles from './HostButton.module.scss';

/**
 * Host Button (orange with rocket icon)
 * Important: This button is NOT guarded by HostOnlyContainer, and it must be wrapped by it.
 */
export function HostButton({
  icon,
  ghost = true,
  className = '',
  ...rest
}: ComponentProps<typeof SendButton>) {
  return (
    <SendButton
      icon={icon ?? <RocketOutlined />}
      ghost={ghost}
      className={clsx(styles.hostButton, className)}
      {...rest}
    />
  );
}

type HostTimedButtonProps = ComponentProps<typeof SendButton> & {
  /**
   * Duration to call onExpire in seconds
   */
  duration?: number;
  /**
   * Function to be called when the time expires
   */
  onExpire?: () => void;
  /**
   * Flag indicating if the timer should be hidden (this cancels the onExpire function)
   */
  hideTimer?: boolean;
};

/**
 * Timed Host Button (orange with rocket icon)
 * Important: This button is NOT  guarded by HostOnlyContainer, and it must be wrapped by it.
 */
export function HostTimedButton({
  duration = 10,
  onExpire,
  hideTimer,
  children,
  ...rest
}: HostTimedButtonProps) {
  const { timeLeft } = useCountdown({
    duration,
    autoStart: true,
    onExpire,
    disabled: hideTimer,
  });

  return (
    <HostButton {...rest}>
      {children}
      {!hideTimer && <span className={styles.hostButtonTimer}>{timeLeft}</span>}
    </HostButton>
  );
}
