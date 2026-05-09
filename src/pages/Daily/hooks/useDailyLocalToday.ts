import { useEffect } from 'react';
import { useLocalStorage } from 'react-use';
// Utils
import { getToday } from 'utils/helpers';
// Internal
import type { WithRequiredId } from '../utils/types';
import { updateStreak } from '../utils/streakManager';
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
    ...defaultValue,
    id: gameId,
  });

  const updateLocalStorage = (value: Partial<TLocal>) => {
    const updated = { ...(localToday ?? defaultValue), ...value };
    setLocalToday(updated);
  };

  return {
    localToday: localToday ?? defaultValue,
    updateLocalStorage,
  };
}

/**
 * Marks a key as played if it is complete and updates the daily streak.
 * @param key - The key to mark as played.
 * @param isComplete - Whether the key is complete.
 */
export function useMarkAsPlayed({ key, isComplete }: { key: string; isComplete: boolean }) {
  const localPlayedKey = composeLocalPlayedKey(key);
  const [played, setPlayed] = useLocalStorage<string>(localPlayedKey, 'unplayed');

  useEffect(() => {
    const today = getToday();

    if (played !== today && isComplete) {
      // Mark as played
      setPlayed(today);

      // Update streak
      updateStreak(key, today);
    }
  }, [isComplete, played, setPlayed, key]);
}
