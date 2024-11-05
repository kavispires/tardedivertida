import { useQuery } from '@tanstack/react-query';
import { sample } from 'lodash';
import moment from 'moment';
import { getSourceName } from 'pages/Daily/utils';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Utils
import { print } from 'utils/helpers';
// Internal
import DEMO from './demo.json';
import { DailyComunicacaoAlienigenaEntry } from './types';
// Services

export const useComunicacaoAlienigenaDemo = () => {
  const { language } = useLanguage();
  const collectionName = getSourceName(language);

  // Load challenge
  return useQuery<DailyComunicacaoAlienigenaEntry>({
    queryKey: [collectionName, language, 'demo'],
    queryFn: async () => {
      console.count(`Fetching ${collectionName}...`);
      const responseData = sample(DEMO) as DailyComunicacaoAlienigenaEntry;
      print({ [collectionName]: responseData }, 'table');
      return responseData;
    },
    staleTime: () => {
      // Calculate time until midnight
      const now = moment();
      const midnight = moment().endOf('day');
      return midnight.diff(now); // Difference in milliseconds
    },
    enabled: language === 'pt',
    retry: false,
  });
};
