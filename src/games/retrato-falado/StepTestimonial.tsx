import { useEffect, useState } from 'react';
import { useTimer } from 'react-timer-hook';
// Utils
import { TIMES, VIEWS } from './utils/constants';
import { inNSeconds } from 'utils/helpers';
// Components
import { ViewSwitch } from 'components/views';
import { ViewAnnouncement } from './components/ViewAnnouncement';
import { ViewLastSeconds } from './components/ViewLastSeconds';
import { ViewSketching } from './components/ViewSketching';
import { ViewWitnessing } from './components/ViewWitnessing';
import { useGlobalState } from 'hooks';

type StepTestimonialProps = {
  isUserTheWitness: boolean;
  currentMonster: Monster;
  onSubmitSketch: GenericFunction;
  onSubmitOrientation: GenericFunction;
};

export function StepTestimonial({
  isUserTheWitness,
  currentMonster,
  onSubmitSketch,
  onSubmitOrientation,
}: StepTestimonialProps) {
  const [monsterOrientation] = useGlobalState('monsterOrientation');
  const [view, setView] = useState(VIEWS.WITNESSING);
  const [lines, setLines] = useState<any>([]);

  const onEnd = () => {
    if (isUserTheWitness && monsterOrientation === 'horizontal') {
      // Submit orientation change if any
      onSubmitOrientation({ orientation: monsterOrientation });
    }
    onSubmitSketch({ sketch: JSON.stringify(lines) });
  };

  const { minutes, seconds } = useTimer({
    expiryTimestamp: inNSeconds(TIMES.TOTAL),
    autoStart: true,
    onExpire: onEnd,
  });

  const timer = minutes * 60 + seconds;

  useEffect(() => {
    // When time is done for memorizing
    if (timer === TIMES.MEMORY_MARK) {
      setView(VIEWS.ANNOUNCEMENT);
    } else if (timer === TIMES.ANNOUNCEMENT_MARK) {
      setView(VIEWS.SKETCHING);
    } else if (timer === TIMES.SKETCH_MARK) {
      setView(VIEWS.FINISHING);
    }
  }, [timer]);

  return (
    <ViewSwitch
      cases={[
        view === VIEWS.WITNESSING,
        view === VIEWS.ANNOUNCEMENT,
        view === VIEWS.SKETCHING,
        view === VIEWS.FINISHING,
      ]}
    >
      <ViewWitnessing
        isUserTheWitness={isUserTheWitness}
        currentMonster={currentMonster}
        remainingWitnessingTime={timer - TIMES.MEMORY_MARK}
        lines={lines}
        setLines={setLines}
      />
      <ViewAnnouncement isUserTheWitness={isUserTheWitness} />
      <ViewSketching
        isUserTheWitness={isUserTheWitness}
        remainingSketchingTime={timer - TIMES.SKETCH_MARK}
        lines={lines}
        setLines={setLines}
      />
      <ViewLastSeconds
        isUserTheWitness={isUserTheWitness}
        remainingTime={timer}
        lines={lines}
        setLines={setLines}
      />
    </ViewSwitch>
  );
}
