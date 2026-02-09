import { useQuery } from '@tanstack/react-query';
import { random, sample, shuffle } from 'lodash';

export function useEndlessVitrais() {
  return useQuery({
    queryKey: ['endless-vitrais'],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const num = random(1, 252);
      const deck = `d${random(13, 14)}`;
      return {
        id: 'endless-vitrais',
        number: 0,
        type: 'vitrais',
        title: 'Vitrais Infinitos',
        cardId: `td-${deck}-${num.toString().padStart(2, '0')}`,
        pieces: shuffle(Array.from({ length: sample([12, 15, 18, 21, 24, 27, 30]) }, (_, i) => i)),
      };
    },
  });
}
