import { useQuery } from '@tanstack/react-query';
import { sample } from 'lodash';
import { getSourceName, wait } from 'pages/Daily/utils';
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
    queryKey: ['comunicacao-alienigena-demo'],
    queryFn: async () => {
      console.count(`Fetching ${collectionName}...`);
      await wait(1250);
      const responseData = sample(DEMO) as DailyComunicacaoAlienigenaEntry;
      print({ [collectionName]: responseData }, 'table');
      return responseData;
    },

    enabled: language === 'pt',
    retry: false,
  });
};
