import { useState } from 'react';

export type UseStep = {
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
};

/**
 * Controls steps
 * @param startingStep
 */
export function useStep(startingStep = 0): UseStep {
  const [step, setStep] = useState<number>(startingStep);

  const goToNextStep = () => setStep((s) => s + 1);

  const goToPreviousStep = () => setStep((s) => (s - 1 < 0 ? 0 : s - 1));

  return {
    step,
    setStep,
    goToNextStep,
    goToPreviousStep,
  };
}
