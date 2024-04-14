import { App } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { DAILY_API, DAILY_API_ACTIONS } from 'services/adapters';
import { print } from 'utils/helpers';

export function useDailyChallenge(today: string, collectionName: string) {
  const { notification } = App.useApp();
  // Load challenge
  return useQuery<any>({
    queryKey: [collectionName],
    queryFn: async () => {
      console.count(`Fetching ${collectionName}...`);
      return await DAILY_API.run({
        action: DAILY_API_ACTIONS.GET_DAILY,
        date: today,
        document: collectionName,
      });
    },
    retry: false,
    onSuccess: (response) => {
      const data = response.data;
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
