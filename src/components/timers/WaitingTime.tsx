// Hooks
import { useCountdown } from 'hooks/useCountdown';

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
    <div className="timer-waiting-time-bar">
      <span className="timer-waiting-time-bar__container">
        <span className="timer-waiting-time-bar__left" style={{ width: `${percentage}%` }} />
      </span>
    </div>
  );
}
