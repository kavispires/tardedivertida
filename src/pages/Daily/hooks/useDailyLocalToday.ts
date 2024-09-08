import { useEffect, useState } from 'react';
import { useLocalStorage } from 'react-use';
import { wait } from '../utils';
import { isDevEnv } from 'utils/helpers';
import { DailyGameStatus } from '../utils/types';

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
  const [localToday, setLocalToday] = useLocalStorage<TLocal & { id: string; status?: DailyGameStatus }>(
    key,
    {
      ...defaultValue,
      id: gameId,
      status: 'idle',
    }
  );

  const [hasAppliedLocalToday, setHasAppliedLocalToday] = useState<boolean>(false);

  useEffect(() => {
    // If stored id is different than the current game id, reset the local storage
    if (localToday && localToday.id !== gameId && !disabled) {
      setLocalToday({ ...defaultValue, id: gameId, number: challengeNumber, idle: 'idle' });
      return;
    }
  }, [localToday, gameId, setLocalToday, defaultValue, challengeNumber, disabled]);

  // Applied the stored local storage to the game
  const stateToApply = localToday && localToday.id === gameId ? localToday : null;

  const updateLocalStorage = (value: Partial<TLocal>) => {
    setLocalToday((prev) => ({ ...(prev ?? defaultValue), id: gameId, number: challengeNumber, ...value }));
  };

  useEffect(() => {
    if (!hasAppliedLocalToday && stateToApply && onApplyLocalState && !disabled) {
      setHasAppliedLocalToday(true);
      // Prevents the onApplyLocalState to be called before the useEffect to check if the id is different happens
      (async () => {
        await wait(250);

        onApplyLocalState(stateToApply);
      })();
    }
  }, [stateToApply]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (hasAppliedLocalToday && isDevEnv) {
      console.table(localToday);
    }
  }, [hasAppliedLocalToday]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    localToday,
    updateLocalStorage,
  };
}
