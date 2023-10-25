import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
// Ant Design Resources
import { App } from 'antd';
// Hooks
import { useLocalStorage } from './useLocalStorage';
import { useLoading } from './useLoading';
import { useGameId } from './useGameId';
import { useError } from './useError';
// API
import { GAME_API } from 'services/adapters';
// Utils
import { print } from 'utils/helpers';

/**
 * Get game meta document
 * Gets stale after 30 minutes
 */
export function useGameMeta(): GameMeta {
  const { notification } = App.useApp();
  const gameId = useGameId();
  const [, setLocalStorage] = useLocalStorage();
  const { setLoader } = useLoading();
  const { setError } = useError();

  // Game gameID
  const query = useQuery({
    queryKey: ['meta', gameId],
    queryFn: async () => {
      console.count('Fetching game meta...');
      return await GAME_API.loadGame({ gameId });
    },
    enabled: Boolean(gameId),
    staleTime: 30 * 60 * 1000, // 30 minutes
    onSuccess: (response) => {
      setLoader('load', true);
      const data = response.data as GameMeta;
      print({ meta: data });
      setLocalStorage({ language: data?.language ?? 'pt' });
    },
    onError: (e: any) => {
      console.error(e);
      setError('meta', JSON.stringify(e.message));
      notification.error({
        message: 'Failed to load game',
        description: JSON.stringify(e.message),
      });
    },
    onSettled: () => {
      setLoader('load', false);
    },
  });

  useEffect(() => {
    if (!query.isError) {
      setError('meta', '');
    }
  }, [query.isError]); // eslint-disable-line

  useEffect(() => {
    setLoader('load', query.isLoading);
  }, [query.isLoading]); // eslint-disable-line

  return (query.data?.data ?? {
    gameId: '',
    gameName: '',
    createdAt: 0,
    createdBy: '',
    isComplete: false,
    isLocked: false,
    language: 'en',
    max: 0,
    min: 0,
    replay: 0,
    options: {},
  }) as GameMeta;
}
