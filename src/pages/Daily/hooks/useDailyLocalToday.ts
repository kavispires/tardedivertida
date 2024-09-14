import { useEffect } from 'react';
import { useLocalStorage } from 'react-use';
// Internal
import { WithRequiredId } from '../utils/types';
import { composeLocalPlayedKey, composeLocalTodayKey } from '../utils';

type UseDailyLocalTodayProps<TLocal> = {
  key: string;
  gameId: string;
  defaultValue: TLocal;
};

/**
 * Custom hook for managing local state related to the current day.
 * @param options - The options for the hook.
 * @param options.key - The key used to compose the local storage key.
 * @param options.gameId - The ID of the game.
 * @param options.defaultValue - The default value for the local state.
 * @returns - An object containing the current local state and a function to update it.
 */
export function useDailyLocalToday<TLocal extends WithRequiredId>({
  key,
  gameId,
  defaultValue,
}: UseDailyLocalTodayProps<TLocal>) {
  const localKey = composeLocalTodayKey(key);
  const [localToday, setLocalToday] = useLocalStorage<TLocal>(localKey, {
    status: 'idle',
    ...defaultValue,
    id: gameId,
  });

  const updateLocalStorage = (value: Partial<TLocal>) => {
    setLocalToday((prev) => ({ ...(prev ?? defaultValue), id: gameId, ...value }));
  };

  return {
    localToday,
    updateLocalStorage,
  };
}

/**
 * Marks a key as played if it is complete.
 * @param key - The key to mark as played.
 * @param isComplete - Whether the key is complete.
 */
export function useMarkAsPlayed({ key, isComplete }: { key: string; isComplete: boolean }) {
  const localPlayedKey = composeLocalPlayedKey(key);
  const [played, setPlayed] = useLocalStorage<boolean>(localPlayedKey, false);

  useEffect(() => {
    if (!played && isComplete) {
      setPlayed(true);
    }
  }, [isComplete, played, setPlayed]);
}
