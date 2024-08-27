import { useLanguage } from 'hooks/useLanguage';
import { sample } from 'lodash';
import { getSourceName, wait } from 'pages/Daily/utils';
import { print } from 'utils/helpers';

import { useQuery } from '@tanstack/react-query';

import jsonData from './data.json';
import { DailyTeoriaDeConjuntosEntry } from './types';
import { useParams } from 'react-router-dom';

const DATA = jsonData as unknown as DailyTeoriaDeConjuntosEntry[];

type DemoResponse = {
  'teoria-de-conjuntos': DailyTeoriaDeConjuntosEntry;
};

export function useTeoriaDeConjuntosDemo(today: string) {
  const { language } = useLanguage();
  const collectionName = getSourceName(language);
  const params = useParams();

  // Load challenge
  return useQuery<DemoResponse>({
    queryKey: ['teoria-de-conjuntos-demo'],
    queryFn: async () => {
      console.count(`Fetching ${collectionName} demo...`);
      await wait(1000);

      let specificNumber = 0;
      if (params['*']?.includes('/')) {
        const val = Number(params['*'].split('teoria-de-conjuntos/')[1]);
        specificNumber = typeof val === 'number' && isFinite(val) ? val : 0;
      }

      const game = specificNumber
        ? Object.values(DATA).find((e) => e.number === specificNumber)
        : sample(DATA) ?? sample(DATA);

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
