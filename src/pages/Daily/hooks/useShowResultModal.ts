import { useEffect, useState } from "react";

export function useShowResultModal(
  condition: boolean,
  onUpdate?: GenericFunction,
) {
  const [showResultModal, setShowResultModal] = useState(false);

  // Controls auto result modal
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (condition) {
      setShowResultModal(true);
      onUpdate?.();
    }
  }, [condition]);

  return { showResultModal, setShowResultModal };
}
