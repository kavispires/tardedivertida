import { useState } from 'react';
// Internal
import { useOnSubmitIntimidationAPIRequest } from './api-requests';
import type { SubmitIntimidationPayload } from './types';

export function useIntimidate(maxIntimidations: number) {
  const onSubmitIntimidationAPI = useOnSubmitIntimidationAPIRequest();
  const [currentIntimidations, setIntimidations] = useState<string[]>([]);
  const onSubmitIntimidation = (studentId: string) => {
    setIntimidations((prevIntimidations) => {
      const newIntimidations = [...prevIntimidations, studentId];
      const shouldGoToTheNextPhase = newIntimidations.length >= maxIntimidations;
      const payload: SubmitIntimidationPayload = {
        intimidatedStudentId: studentId,
        shouldGoToTheNextPhase,
      };

      if (shouldGoToTheNextPhase) {
        payload.intimidatedStudentsIds = [...newIntimidations];
      }

      onSubmitIntimidationAPI(payload);

      return newIntimidations;
    });
  };

  return {
    currentIntimidations,
    onSubmitIntimidation,
  };
}
