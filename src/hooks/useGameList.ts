import { useQuery } from '@tanstack/react-query';
// Types
import type { GameInfo } from 'types/game-info';
// Utils
import { getGameList } from 'utils/info';

/**
 * Hook that fetches and caches the complete game list.
 * Uses TanStack Query for caching and automatic state management.
 */
export function useGameList() {
  return useQuery<Record<GameName, GameInfo>>({
    queryKey: ['gameList'],
    queryFn: getGameList,
    staleTime: Number.POSITIVE_INFINITY, // Game list rarely changes, so keep it fresh indefinitely
  });
}

/**
 * Hook that fetches only playable games (stable and beta releases).
 */
export function usePlayableGames() {
  return useQuery<Record<GameName, GameInfo>>({
    queryKey: ['playableGames'],
    queryFn: async () => {
      const gameList = await getGameList();
      return Object.entries(gameList).reduce((acc: Record<GameName, GameInfo>, [gameName, info]) => {
        if (['stable', 'beta'].includes(info.release)) {
          acc[gameName] = info;
        }
        return acc;
      }, {});
    },
    staleTime: Number.POSITIVE_INFINITY,
  });
}
