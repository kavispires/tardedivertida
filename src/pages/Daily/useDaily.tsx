import { App } from 'antd';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { DAILY_API, DAILY_API_ACTIONS } from 'services/adapters';
import { print } from 'utils/helpers';
import { useLocalStorage } from 'hooks/useLocalStorage';
import { useEffect, useState } from 'react';
import { ArteRuimLocalToday, DailyArteRuimEntry } from './types';

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
      return await DAILY_API.run({ action: DAILY_API_ACTIONS.SAVE_DAILY, ...data });
    },
    onSuccess: () => {
      queryClient.refetchQueries(['user']);
    },
    onError: (e: any) => {},
  });
}

/**
 * Keeps local storage updated so that the user can continue where they left off
 * @param source
 * @param game
 * @returns
 */
export function useDailyLocalStorage(source: string, game: DailyArteRuimEntry) {
  const [getLocalProperty, setLocalProperty] = useLocalStorage();

  const [localToday, setLocalToday] = useState<ArteRuimLocalToday>({
    hearts: 3,
    id: game.id,
    letters: [],
    number: 0,
    victory: false,
  });

  useEffect(() => {
    const previousLocalToday = getLocalProperty(source);
    if (previousLocalToday && previousLocalToday.id === game.id) {
      setLocalToday(previousLocalToday);
      return;
    }
  }, [getLocalProperty, source, game]);

  const updateLocalStorage = (value: any) => {
    setLocalProperty({ [source]: value });
    setLocalToday(value);
  };

  return {
    localToday,
    updateLocalStorage,
  };
}
