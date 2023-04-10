import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useLocation, useNavigate } from 'react-router';
// Ant Design Resources
import { message, notification } from 'antd';
// Hooks
import { useLanguage } from './useLanguage';
import { useLocalStorage } from './useLocalStorage';
import { useLoading } from './useLoading';
// API
import { GAME_API } from 'services/adapters';
// Utils
import { getGameIdFromPathname, isValidGameId, print } from 'utils/helpers';

/**
 * Get game meta document
 * Gets stale after 30 minutes
 */
export function useGameMeta(): GameMeta {
  const { pathname } = useLocation();
  const { translate } = useLanguage();
  const [gameId, setGameId] = useState(getGameIdFromPathname(pathname));
  const [, setLocalStorage] = useLocalStorage();
  const { setLoader } = useLoading();

  const navigate = useNavigate();

  // Verify url game code
  useEffect(() => {
    const urlGameId = getGameIdFromPathname(pathname);
    if (isValidGameId(urlGameId)) {
      setGameId(urlGameId);
    } else {
      message.error(
        translate(
          'Vixi, a id do jogo na barra de endereços tá errada',
          'Oops, the game id in the address bar is invalid'
        )
      );
      navigate('/');
    }
  }, [pathname, setGameId]); // eslint-disable-line

  // Game gameID
  const query = useQuery({
    queryKey: gameId,
    queryFn: async () => {
      console.log('Fetching game meta...');
      return await GAME_API.loadGame({ gameId });
    },
    enabled: Boolean(gameId),
    staleTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
    onSuccess: (response) => {
      const data = response.data as GameMeta;
      print({ meta: data });
      setLocalStorage({ language: data?.language ?? 'pt' });
    },
    onError: (e: any) => {
      console.error(e);
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
