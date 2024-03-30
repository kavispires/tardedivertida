import { Slider } from 'antd';
import { useCountdown } from 'hooks/useCountdown';

type TimeForActionProps = {
  duration: number;
  onExpire?: () => void;
  timeLeft?: number;
};

function calculateProgress(duration: number, timeLeft: number) {
  const percentage = (timeLeft / duration) * 100;

  return [50 - percentage / 2, 100 - (100 - percentage) / 2];
}

export function WaitingTime({ duration, timeLeft, onExpire }: TimeForActionProps) {
  const { timeLeft: privateTimeLeft } = useCountdown({
    duration,
    autoStart: timeLeft === undefined,
    onExpire,
  });

  return (
    <Slider
      range
      value={calculateProgress(duration, timeLeft ?? privateTimeLeft)}
      className="timer-waiting-time"
    />
  );
}
