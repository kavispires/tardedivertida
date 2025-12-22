import { useEffect, useState } from 'react';

export function useShowResultModal(condition: boolean, onUpdate?: () => void) {
  const [showResultModal, setShowResultModal] = useState(false);

  // Controls auto result modal
  // biome-ignore lint/correctness/useExhaustiveDependencies: only condition is important
  useEffect(() => {
    if (condition) {
      setShowResultModal(true);
      onUpdate?.();
    }
  }, [condition]);

  return { showResultModal, setShowResultModal };
}
