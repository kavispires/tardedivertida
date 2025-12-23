import { useQuery } from '@tanstack/react-query';
import { sample } from 'lodash';
// Internal
import type { DailyVitraisEntry } from './types';
import { generatePuzzleData } from './puzzleUtils';

const DEMO_CARD_IDS = [
  'td-d1-25',
  'td-d1-21',
  'td-d11-217',
  'td-d11-133',
  'td-d11-110',
  'td-d12-175',
  'td-d12-155',
  'td-d12-126',
];

export function useGetVitraisDemo() {
  return useQuery<DailyVitraisEntry>({
    queryKey: ['daily', 'vitrais', 'demo'],
    queryFn: async () => {
      return generatePuzzleData(sample(DEMO_CARD_IDS) ?? DEMO_CARD_IDS[0], undefined, 10);
    },
  });
}
