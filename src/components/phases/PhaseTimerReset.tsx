import { useEffect, useRef } from 'react';
// Hooks
import type { UseStep } from 'hooks/useStep';

type PhaseTimerResetProps = {
  goToNextStep: UseStep['goToNextStep'];
};

/**
 * Component to be placed in between sequential PhaseAnnouncement
 * to reset the automatic timer.
 */
export function PhaseTimerReset({ goToNextStep }: PhaseTimerResetProps) {
  const calledRef = useRef(false);

  useEffect(() => {
    if (calledRef.current) return; // prevent second call (StrictMode remount)
    calledRef.current = true;

    const delay = () => new Promise((res) => setTimeout(res, 100));
    const next = async () => {
      await delay();
      goToNextStep();
    };

    next();
  }, [goToNextStep]);

  return <div></div>;
}
