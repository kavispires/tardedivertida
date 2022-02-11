import { useTimer } from 'react-timer-hook';
// Utils
import { inNTime } from '../../utils/helpers';

type TimerProps = {
  timer: Timer;
  hideAccusationSelect: GenericFunction;
  setStep: GenericFunction;
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
