import { useEffect } from 'react';
import { useLocalStorage } from 'react-use';

type UseDailyLocalTodayProps<TLocal> = {
  key: string;
  gameId: string;
  defaultValue: TLocal;
};

export function useDailyLocalToday<TLocal = { id: string }>({
  key,
  gameId,
  defaultValue,
}: UseDailyLocalTodayProps<TLocal>) {
  const [localToday, setLocalToday] = useLocalStorage<TLocal & { id: string }>(key, {
    ...defaultValue,
    id: gameId,
  });

  useEffect(() => {
    // If stored id is different than the current game id, reset the local storage
    if (localToday && localToday.id !== gameId) {
      setLocalToday({ ...defaultValue, id: gameId });
      return;
    }
  }, [localToday, gameId, setLocalToday, defaultValue]);

  // Applied the stored local storage to the game
  const stateToApply = localToday && localToday.id === gameId ? localToday : null;

  const updateLocalStorage = (value: Partial<TLocal>) => {
    setLocalToday((prev) => ({ id: gameId, ...(prev ?? defaultValue), ...value }));
  };

  return {
    localToday,
    updateLocalStorage,
    stateToApply,
  };
}
