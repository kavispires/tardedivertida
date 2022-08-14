// Hooks
import { useCountdown } from 'hooks';
// Components
import { TimerBar } from './TimerBar';

type TimedTimerBarProps = {
  /**
   * Duration in seconds
   */
  duration: number;
  /**
   * Number of ticks in the bar
   */
  steps: number;
  /**
   * Function executed when the time is up
   */
  onExpire: GenericFunction;
  /**
   * Type of bar. Default: line
   */
  type?: 'circle' | 'line' | 'dashboard';
};

export function TimedTimerBar({ duration, onExpire, type, steps = 10 }: TimedTimerBarProps) {
  const { timeLeft } = useCountdown({
    duration,
    autoStart: true,
    onExpire,
  });

  return (
    <div>
      {timeLeft} <TimerBar steps={steps} value={timeLeft} total={duration} type={type} /> {timeLeft}
    </div>
  );
}
