import { useTimer } from 'react-timer-hook';
// Types
import type { TimerType } from '../utils/types';
import type { UseStep } from 'hooks/useStep';
// Utils
import { inNTime } from 'utils/helpers';

type TimerProps = {
  timer: TimerType;
  hideAccusationSelect: GenericFunction;
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
