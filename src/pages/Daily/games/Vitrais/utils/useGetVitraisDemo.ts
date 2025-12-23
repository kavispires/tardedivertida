import { useQuery } from '@tanstack/react-query';
import { sample } from 'lodash';
// Internal
import type { DailyVitraisEntry } from './types';
import { generatePuzzleData } from './puzzleUtils';

const DEMO_CARD_IDS = ['td-d1-106', 'td-d1-111', 'td-d1-191', 'td-d1-207', 'td-d1-216'];

export function useGetVitraisDemo() {
  return useQuery<DailyVitraisEntry>({
    queryKey: ['daily', 'vitrais', 'demo'],
    queryFn: async () => {
      return generatePuzzleData(sample(DEMO_CARD_IDS) ?? DEMO_CARD_IDS[0], undefined, 10);
    },
  });
}
