// Hooks
import { useCountdown } from 'hooks/useCountdown';
// Sass
import styles from './timers.module.scss';
// Styles

type TimeForActionProps = {
  duration: number;
  onExpire?: () => void;
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
