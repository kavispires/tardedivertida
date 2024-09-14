import { useEffectOnce } from 'react-use';
// Hooks
import { UseStep } from 'hooks/useStep';

type PhaseTimerResetProps = {
  goToNextStep: UseStep['goToNextStep'];
};

/**
 * Component to be place in between sequential PhaseAnnouncement to reset the automatic timer
 * @param props
 * @returns
 */
export function PhaseTimerReset({ goToNextStep }: PhaseTimerResetProps) {
  useEffectOnce(() => {
    const delay = () => new Promise((res) => setTimeout(res, 100));
    const next = async () => {
      await delay();
      goToNextStep();
    };

    next();
  });

  return <div></div>;
}
