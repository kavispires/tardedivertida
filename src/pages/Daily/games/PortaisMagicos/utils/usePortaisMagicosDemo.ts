import { useQuery } from '@tanstack/react-query';
import { getSourceName, wait } from 'pages/Daily/utils';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Utils
import { print } from 'utils/helpers';
// Internal
import DEMO from './demo.json';
import type { DailyPortaisMagicosEntry } from './types';

export const usePortaisMagicosDemo = () => {
  const { language } = useLanguage();
  const collectionName = getSourceName(language);

  // Load challenge
  return useQuery<DailyPortaisMagicosEntry>({
    queryKey: ['portais-magicos-demo'],
    queryFn: async () => {
      console.count(`Fetching demo ${collectionName}...`);
      await wait(1250);
      const responseData = DEMO[0] as DailyPortaisMagicosEntry;
      print({ [collectionName]: responseData }, 'table');
      return responseData;
    },

    enabled: language === 'pt',
    retry: false,
  });
};
