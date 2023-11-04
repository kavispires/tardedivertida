import { App } from 'antd';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { DAILY_API } from 'services/adapters';
import { print } from 'utils/helpers';

export function useDailyChallenge(today: string) {
  const { notification } = App.useApp();
  // Load challenge
  return useQuery<any>({
    queryKey: ['daily'],
    queryFn: async () => {
      console.count('Fetching user...');
      return await DAILY_API.getDaily({ date: today });
    },
    retry: false,
    onSuccess: (response) => {
      const data = response.data;
      print({ daily: data }, 'table');
    },
    onError: (e: any) => {
      notification.error({
        message: 'Failed to load user',
        description: JSON.stringify(e.message),
      });
    },
  });
}

export type DailySetterPayload = {
  id: string; // Format YYYY-MM-DD
  number: number;
  victory: boolean;
  hearts: number;
  letters: string[];
};

export function useDailyChallengeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['daily', 'submit'],
    mutationFn: async (data: DailySetterPayload) => {
      return await DAILY_API.saveDaily(data);
    },
    onSuccess: () => {
      queryClient.refetchQueries(['user']);
    },
    onError: (e: any) => {},
  });
}
