import { useState } from 'react';

export type UseStep = {
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  goToSteps: (step: number) => void;
};

/**
 * Controls steps
 * @param startingStep
 */
export function useStep(startingStep = 0): UseStep {
  const [step, setStep] = useState<number>(startingStep);

  const goToNextStep = () => setStep((s) => s + 1);

  const goToPreviousStep = () => setStep((s) => Math.max(0, s - 1));

  const goToSteps = (step: number) => setStep((s) => Math.max(0, s + step));

  return {
    step,
    setStep,
    goToNextStep,
    goToPreviousStep,
    goToSteps,
  };
}
