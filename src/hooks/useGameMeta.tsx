import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
// Ant Design Resources
import { App } from 'antd';
// Types
import type { GameMeta } from 'types/game';
// Hooks
import { useLocalStorage } from './useLocalStorage';
import { useLoading } from './useLoading';
import { useGameId } from './useGameId';
import { useError } from './useError';
// API
import { GAME_API, GAME_API_ACTIONS } from 'services/adapters';
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
      setLoader('load', true);
      console.count('Fetching game meta...');

      const response = await GAME_API.run({ action: GAME_API_ACTIONS.LOAD_GAME, gameId });
      const data = response.data as GameMeta;

      print({ meta: data });
      setLocalStorage({ language: data?.language ?? 'pt' });
      setLoader('load', false);
      return response;
    },
    enabled: Boolean(gameId),
    staleTime: 30 * 60 * 1000, // 30 minutes
  });

  useEffect(() => {
    if (!query.isError && query.isSuccess) {
      setError('meta', '');
    }
    if (query.isError) {
      console.error(query.error);
      setError('meta', JSON.stringify(query.error.message));
      notification.error({
        message: 'Failed to load game',
        description: JSON.stringify(query.error.message),
      });
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
