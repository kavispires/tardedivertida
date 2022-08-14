import { useEffect, useState } from 'react';
// Hooks
import { useCountdown, useGlobalState } from 'hooks';
// Utils
import { TIMES, VIEWS } from './utils/constants';
// Components
import { ViewSwitch } from 'components/views';
import { ViewAnnouncement } from './components/ViewAnnouncement';
import { ViewLastSeconds } from './components/ViewLastSeconds';
import { ViewSketching } from './components/ViewSketching';
import { ViewWitnessing } from './components/ViewWitnessing';

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

  const { timeLeft } = useCountdown({
    duration: TIMES.TOTAL,
    autoStart: true,
    onExpire: onEnd,
  });

  useEffect(() => {
    // When time is done for memorizing
    if (timeLeft === TIMES.MEMORY_MARK) {
      setView(VIEWS.ANNOUNCEMENT);
    } else if (timeLeft === TIMES.ANNOUNCEMENT_MARK) {
      setView(VIEWS.SKETCHING);
    } else if (timeLeft === TIMES.SKETCH_MARK) {
      setView(VIEWS.FINISHING);
    }
  }, [timeLeft]);

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
        remainingWitnessingTime={timeLeft - TIMES.MEMORY_MARK}
        lines={lines}
        setLines={setLines}
      />
      <ViewAnnouncement isUserTheWitness={isUserTheWitness} />
      <ViewSketching
        isUserTheWitness={isUserTheWitness}
        remainingSketchingTime={timeLeft - TIMES.SKETCH_MARK}
        lines={lines}
        setLines={setLines}
      />
      <ViewLastSeconds
        isUserTheWitness={isUserTheWitness}
        remainingTime={timeLeft}
        lines={lines}
        setLines={setLines}
      />
    </ViewSwitch>
  );
}
