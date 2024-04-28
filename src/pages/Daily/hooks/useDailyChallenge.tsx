import { App } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { DAILY_API, DAILY_API_ACTIONS } from 'services/adapters';
import { print } from 'utils/helpers';
import { DailyResponse } from '../utils/types';
import { useLanguage } from 'hooks/useLanguage';
import { getSourceName } from '../utils';

export function useDailyChallenge(today: string) {
  const { notification } = App.useApp();
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
      return response.data as DailyResponse;
    },
    retry: false,
    onSuccess: (response) => {
      const data = response;
      print({ [collectionName]: data }, 'table');
    },
    onError: (e: any) => {
      notification.error({
        message: 'Failed to load user',
        description: JSON.stringify(e.message),
      });
    },
  });
}
