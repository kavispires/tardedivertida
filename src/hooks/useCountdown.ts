import { TimerResult, TimerSettings, useTimer } from 'react-timer-hook';
import { inNSeconds } from 'utils/helpers';

type SelectedTimeSettings = Omit<TimerSettings, 'expiryTimestamp'>;

interface useCountdownSettings extends SelectedTimeSettings {
  /**
   * The duration of the countdown in seconds
   */
  duration: number;
  /**
   * Disable timer
   */
  disabled?: boolean;
}

interface useCountdownResults extends TimerResult {
  /**
   * Time left in total seconds (minutes + seconds)
   */
  timeLeft: number;
}

/**
 * Timer countdown to perform actions
 * @param settings
 * @returns
 */
export function useCountdown({
  duration,
  onExpire,
  disabled = false,
  ...rest
}: useCountdownSettings): useCountdownResults {
  const timer = useTimer({
    expiryTimestamp: inNSeconds(duration),
    onExpire: disabled ? undefined : onExpire,
    ...rest,
  });

  const timeLeft = timer.minutes * 60 + timer.seconds;

  return {
    ...timer,
    timeLeft,
  };
}