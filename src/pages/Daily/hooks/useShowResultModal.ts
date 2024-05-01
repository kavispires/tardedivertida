import { useEffect, useState } from 'react';

export function useShowResultModal(condition: boolean, onUpdate?: GenericFunction) {
  const [showResultModal, setShowResultModal] = useState(false);

  // Controls auto result modal
  useEffect(() => {
    if (condition) {
      setShowResultModal(true);
      onUpdate?.();
    }
  }, [condition]); // eslint-disable-line react-hooks/exhaustive-deps

  return { showResultModal, setShowResultModal };
}
