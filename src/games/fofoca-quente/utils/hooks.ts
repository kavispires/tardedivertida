import { useMemo } from 'react';
// Internal
import type { Student } from './types';

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
