import { useTimer } from 'react-timer-hook';
// Hooks
import type { UseStep } from 'hooks/useStep';
// Utils
import { inNTime } from 'utils/helpers';
// Internal
import type { TimerType } from '../utils/types';

type TimerProps = {
  timer: TimerType;
  hideAccusationSelect: () => void;
  setStep: UseStep['setStep'];
};

export function Timer({ timer, hideAccusationSelect, setStep }: TimerProps) {
  const onTimesUp = () => {
    hideAccusationSelect();
    setStep(2);
  };

  const { minutes, seconds } = useTimer({
    expiryTimestamp: inNTime(timer.timeRemaining - 2000),
    autoStart: true,
    onExpire: onTimesUp,
  });

  return (
    <div className="e-timer">
      {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
    </div>
  );
}
