import { useTimer } from 'react-timer-hook';
import { inNSeconds } from 'utils/helpers';
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
  const { minutes, seconds } = useTimer({
    expiryTimestamp: inNSeconds(duration),
    autoStart: true,
    onExpire,
  });

  const timer = minutes * 60 + seconds;

  return (
    <div>
      {timer} <TimerBar steps={steps} value={timer} total={duration} type={type} /> {timer}
    </div>
  );
}
