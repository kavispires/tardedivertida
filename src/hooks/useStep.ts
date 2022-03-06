import { useState } from 'react';

/**
 * Controls steps
 * @param startingStep
 */
export function useStep(startingStep = 0): {
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  nextStep: GenericFunction;
  previousStep: GenericFunction;
} {
  const [step, setStep] = useState<number>(startingStep);

  const nextStep = () => setStep((s) => s + 1);

  const previousStep = () => setStep((s) => (s - 1 < 0 ? 0 : s - 1));

  return {
    step,
    setStep,
    nextStep,
    previousStep,
  };
}
