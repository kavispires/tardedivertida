import { useQuery } from '@tanstack/react-query';
import { sample } from 'lodash';
import { getSourceName, wait } from 'pages/Daily/utils';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Utils
import { print } from 'utils/helpers';
// Internal
import DEMO from './demo.json';
import type { DailyQuartetosEntry } from './types';

export const useQuartetosDemo = () => {
  const { language } = useLanguage();
  const collectionName = getSourceName(language);

  // Load challenge
  return useQuery<DailyQuartetosEntry>({
    queryKey: ['quartetos-demo'],
    queryFn: async () => {
      console.count(`Fetching demo ${collectionName}...`);
      await wait(1250);
      const responseData = sample(DEMO) as DailyQuartetosEntry;

      print({ [collectionName]: responseData }, 'table');
      return responseData;
    },

    enabled: language === 'pt',
    retry: false,
  });
};
