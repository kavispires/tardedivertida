import { useTimer } from 'react-timer-hook';
// Utils
import { inNSeconds } from 'utils/helpers';

type UseTimerArgs = Parameters<typeof useTimer>[0];

type UseTimerReturnType = ReturnType<typeof useTimer>;

export interface useCountdownSettings extends Omit<UseTimerArgs, 'expiryTimestamp'> {
  /**
   * The duration of the countdown in seconds
   */
  duration: number;
  /**
   * Disable timer
   */
  disabled?: boolean;
}

interface useCountdownReturnValue extends UseTimerReturnType {
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

  const timeLeft = timer.totalSeconds;

  return {
    ...timer,
    timeLeft,
  };
}
