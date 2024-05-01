import { useEffect, useState } from 'react';
import { useLocalStorage } from 'react-use';

type UseDailyLocalTodayProps<TLocal> = {
  key: string;
  gameId: string;
  challengeNumber: number;
  defaultValue: TLocal;
  onApplyLocalState?: (value: TLocal) => void;
  disabled?: boolean;
};

export function useDailyLocalToday<TLocal = { id: string }>({
  key,
  gameId,
  challengeNumber,
  defaultValue,
  onApplyLocalState,
  disabled,
}: UseDailyLocalTodayProps<TLocal>) {
  const [localToday, setLocalToday] = useLocalStorage<TLocal & { id: string }>(key, {
    ...defaultValue,
    id: gameId,
  });
  const [hasAppliedLocalToday, setHasAppliedLocalToday] = useState<boolean>(false);

  useEffect(() => {
    // If stored id is different than the current game id, reset the local storage
    if (localToday && localToday.id !== gameId && !disabled) {
      setLocalToday({ ...defaultValue, id: gameId, number: challengeNumber });
      return;
    }
  }, [localToday, gameId, setLocalToday, defaultValue, challengeNumber, disabled]);

  // Applied the stored local storage to the game
  const stateToApply = localToday && localToday.id === gameId ? localToday : null;

  const updateLocalStorage = (value: Partial<TLocal>) => {
    setLocalToday((prev) => ({ id: gameId, number: challengeNumber, ...(prev ?? defaultValue), ...value }));
  };

  useEffect(() => {
    if (!hasAppliedLocalToday && stateToApply && onApplyLocalState && !disabled) {
      setHasAppliedLocalToday(true);
      onApplyLocalState(stateToApply);
    }
  }, [stateToApply]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    localToday,
    updateLocalStorage,
  };
}
