import { useMemo, useState } from 'react';
// Internal
import type { Student, SubmitIntimidationPayload } from './types';
import { useOnSubmitIntimidationAPIRequest, useOnSubmitRumorAPIRequest } from './api-requests';

export function useBoardSummary(students: Dictionary<Student>) {
  return useMemo(() => {
    const gendersDict: NumberDictionary = {};
    const buildsDict: NumberDictionary = {};
    const heightsDict: NumberDictionary = {};
    const agesDict: NumberDictionary = {};
    const socialGroupsDict: NumberDictionary = {};
    Object.values(students).forEach(({ gender, age, build, height, socialGroupId }) => {
      gendersDict[gender] = (gendersDict[gender] ?? 0) + 1;
      buildsDict[build] = (buildsDict[build] ?? 0) + 1;
      heightsDict[height] = (heightsDict[height] ?? 0) + 1;
      agesDict[age] = (agesDict[age] ?? 0) + 1;
      socialGroupsDict[socialGroupId] = (socialGroupsDict[socialGroupId] ?? 0) + 1;
    });

    return {
      gendersDict,
      buildsDict,
      heightsDict,
      agesDict,
      socialGroupsDict,
    };
  }, [students]);
}

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

export function useRumoring() {
  const onSubmitRumorAPI = useOnSubmitRumorAPIRequest();
  const onSubmitRumor = (studentId: string, rumorIndex: number) => {
    onSubmitRumorAPI({
      rumoredStudentId: studentId,
      rumorIndex,
      skipRumor: false,
    });
  };

  return {
    onSubmitRumor,
  };
}
