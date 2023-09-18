import clsx from 'clsx';
// Hooks
import { useCountdown } from 'hooks/useCountdown';
// Components
import { TimerBar } from './TimerBar';

type TimedTimerBarProps = {
  /**
   * Duration in seconds
   */
  duration: number;
  /**
   * Function executed when the time is up
   */
  onExpire: GenericFunction;
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

export function TimedTimerBar({ duration, onExpire, type, steps = 10, className }: TimedTimerBarProps) {
  const { timeLeft } = useCountdown({
    duration,
    autoStart: true,
    onExpire,
  });

  return (
    <div className={clsx('timer-number', className)}>
      {timeLeft} <TimerBar steps={steps} value={timeLeft} total={duration} type={type} /> {timeLeft}
    </div>
  );
}
