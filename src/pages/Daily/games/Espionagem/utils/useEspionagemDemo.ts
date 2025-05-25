import { useQuery } from '@tanstack/react-query';
import moment from 'moment';
// Internal
import { DEMO } from './data';
import type { DailyEspionagemEntry } from './types';

export function useEspionagemDemo() {
  return useQuery<DailyEspionagemEntry, Error>({
    queryKey: ['espionagemDemo'],
    queryFn: () => {
      const dayOfYear = moment().dayOfYear(); // 1 to 366
      const index = (dayOfYear - 1) % DEMO.length;
      return DEMO[index];
    },
  });
}
