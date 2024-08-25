import { useLanguage } from 'hooks/useLanguage';
import { sample } from 'lodash';
import { getSourceName, wait } from 'pages/Daily/utils';
import { print } from 'utils/helpers';

import { useQuery } from '@tanstack/react-query';

import jsonData from './data.json';
import { DailyTeoriaDeConjuntosEntry } from './types';

const DATA = jsonData as unknown as DailyTeoriaDeConjuntosEntry[];

type DemoResponse = {
  'teoria-de-conjuntos': DailyTeoriaDeConjuntosEntry;
};

export function useTeoriaDeConjuntosDemo(today: string) {
  const { language } = useLanguage();
  const collectionName = getSourceName(language);

  // Load challenge
  return useQuery<DemoResponse>({
    queryKey: ['teoria-de-conjuntos-demo'],
    queryFn: async () => {
      console.count(`Fetching ${collectionName} demo...`);
      await wait(1000);

      const game = sample(DATA);

      const entry: DailyTeoriaDeConjuntosEntry = {
        ...game!,
        id: today,
        type: 'teoria-de-conjuntos',
      };

      const responseData = {
        'teoria-de-conjuntos': entry,
      };

      print({ demo: responseData }, 'table');
      return responseData;
    },
    enabled: language === 'pt',
    retry: false,
  });
}
