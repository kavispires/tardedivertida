import { useMutation, useQueryClient } from '@tanstack/react-query';
// Services
import { DAILY_API, DAILY_API_ACTIONS } from 'services/adapters';

type DailySetterPayload = {
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
      return await DAILY_API.run({ action: DAILY_API_ACTIONS.SAVE_DAILY, ...data });
    },
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: ['user'],
      });
    },
    onError: (e: any) => {},
  });
}
