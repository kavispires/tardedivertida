// Hooks
import { useCountdown } from 'hooks/useCountdown';
// Sass
import styles from './timers.module.scss';
// Styles

type TimeForActionProps = {
  /**
   * The duration of the countdown in seconds
   */
  duration: number;
  /**
   * Callback function to be called when the timer expires
   */
  onExpire?: () => void;
  /**
   * The time left in seconds (optional, for controlled countdown)
   */
  timeLeft?: number;
};

export function WaitingTime({ duration, timeLeft, onExpire }: TimeForActionProps) {
  const { timeLeft: privateTimeLeft } = useCountdown({
    duration,
    autoStart: timeLeft === undefined,
    onExpire,
  });

  const percentage = ((timeLeft ?? privateTimeLeft) / duration) * 100;

  return (
    <div className={styles.timerWaitingTimeBar}>
      <span className={styles.timerWaitingTimeBar__container}>
        <span
          className={styles.timerWaitingTimeBar__left}
          style={{ width: `${percentage}%` }}
        />
      </span>
    </div>
  );
}
