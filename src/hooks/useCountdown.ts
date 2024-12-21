import { type TimerResult, type TimerSettings, useTimer } from 'react-timer-hook';
// Utils
import { inNSeconds } from 'utils/helpers';

type SelectedTimeSettings = Omit<TimerSettings, 'expiryTimestamp'>;

export interface useCountdownSettings extends SelectedTimeSettings {
  /**
   * The duration of the countdown in seconds
   */
  duration: number;
  /**
   * Disable timer
   */
  disabled?: boolean;
}

interface useCountdownReturnValue extends TimerResult {
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
}: useCountdownSettings): useCountdownReturnValue {
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
