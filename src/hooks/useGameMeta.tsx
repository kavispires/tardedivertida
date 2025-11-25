import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
// Ant Design Resources
import { App } from 'antd';
// Types
import type { GameMeta } from 'types/game';
// Services
import { GAME_API_COMMON_ACTIONS, GAME_API } from 'services/adapters';
// Utils
import { print } from 'utils/helpers';
// Internal
import { useLanguage } from './useLanguage';
import { useLoading } from './useLoading';
import { useGameId } from './useGameId';
import { useError } from './useError';

/**
 * Get game meta document
 * Gets stale after 30 minutes
 */
export function useGameMeta(): GameMeta {
  const { notification } = App.useApp();
  const gameId = useGameId();
  const { setLanguage } = useLanguage();
  const { setLoader } = useLoading();
  const { setError } = useError();

  // Game gameID
  const query = useQuery({
    queryKey: ['meta', gameId],
    queryFn: async () => {
      setLoader('load', true);
      // biome-ignore lint/suspicious/noConsole: on purpose
      console.count('Fetching game meta...');

      const response = await GAME_API.run({
        action: GAME_API_COMMON_ACTIONS.LOAD_GAME,
        gameId,
      });
      const data = response.data as GameMeta;

      print({ meta: data });
      setLanguage(data?.language ?? 'pt');
      setLoader('load', false);
      return response;
    },
    enabled: Boolean(gameId),
    staleTime: 30 * 60 * 1000, // 30 minutes
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: we only want to trigger this when the error state changes
  useEffect(() => {
    if (!query.isError && query.isSuccess) {
      setError('meta', '');
    }
    if (query.isError) {
      // biome-ignore lint/suspicious/noConsole: we want to log errors for debugging purposes
      console.error(query.error);
      setError('meta', JSON.stringify(query.error.message));
      notification.error({
        title: 'Failed to load game',
        description: JSON.stringify(query.error.message),
      });
    }
  }, [query.isError]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: we only want to trigger this when the loading state changes
  useEffect(() => {
    setLoader('load', query.isLoading);
  }, [query.isLoading]);

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
