import { useQuery } from '@tanstack/react-query';
import moment from 'moment';
// Internal
import { DEMO } from './data';
import type { DailyOrganikuEntry } from './types';

export function useOrganikuDemo() {
  return useQuery<DailyOrganikuEntry, Error>({
    queryKey: ['organikuDemo'],
    queryFn: () => {
      const dayOfYear = moment().dayOfYear(); // 1 to 366
      const index = (dayOfYear - 1) % DEMO.length;
      return DEMO[index];
    },
  });
}
