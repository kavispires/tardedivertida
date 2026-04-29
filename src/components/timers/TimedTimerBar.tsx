import clsx from 'clsx';
// Hooks
import { useCountdown } from 'hooks/useCountdown';
// Internal
import { TimerBar } from './TimerBar';
// Sass
import styles from './timers.module.scss';

type TimedTimerBarProps = {
  /**
   * Duration in seconds
   */
  duration: number;
  /**
   * Function executed when the time is up
   */
  onExpire: () => void;
  /**
   * Number of ticks in the bar
   */
  steps?: number;
  /**
   * Type of bar. Default: line
   */
  type?: 'circle' | 'line' | 'dashboard';
  /**
   * Optional class name
   */
  className?: string;
};

/**
 * Timer progress bar that automatically counts down and triggers callback on expiration
 */
export function TimedTimerBar({ duration, onExpire, type, steps = 10, className }: TimedTimerBarProps) {
  const { timeLeft } = useCountdown({
    duration,
    autoStart: true,
    onExpire,
  });

  return (
    <div className={clsx(styles.timerNumber, className)}>
      {timeLeft}{' '}
      <TimerBar
        steps={steps}
        value={timeLeft}
        total={duration}
        type={type}
      />{' '}
      {timeLeft}
    </div>
  );
}
