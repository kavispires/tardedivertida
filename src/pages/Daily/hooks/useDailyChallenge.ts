import { useQuery } from '@tanstack/react-query';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Services
import { DAILY_API, DAILY_API_ACTIONS } from 'services/adapters';
// Utils
import { print } from 'utils/helpers';
// Internal
import { DailyResponse } from '../utils/types';
import { getSourceName } from '../utils';

export function useDailyChallenge(today: string) {
  const { language } = useLanguage();
  const collectionName = getSourceName(language);

  // Load challenge
  return useQuery<DailyResponse>({
    queryKey: [collectionName],
    queryFn: async () => {
      console.count(`Fetching ${collectionName}...`);
      const response = await DAILY_API.run({
        action: DAILY_API_ACTIONS.GET_DAILY,
        date: today,
        document: collectionName,
      });
      const responseData = response.data as DailyResponse;
      print({ [collectionName]: responseData }, 'table');
      return responseData;
    },
    enabled: language === 'pt',
    retry: false,
  });
}
