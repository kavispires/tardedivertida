import { useEffect, useState } from 'react';
import { useLocalStorage } from 'react-use';
import { isDevEnv } from 'utils/helpers';

import { composeLocalPlayedKey, composeLocalTodayKey, wait } from '../utils';
import { DailyGameStatus, WithRequiredId } from '../utils/types';

type UseDailyLocalTodayProps<TLocal> = {
  key: string;
  gameId: string;
  challengeNumber: number;
  defaultValue: TLocal;
  onApplyLocalState?: (value: TLocal) => void;
  disabled?: boolean;
};

/**
 * @deprecated
 */
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

type UseDailyLocalTodayPropsV2<TLocal> = {
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
export function useDailyLocalTodayV2<TLocal extends WithRequiredId>({
  key,
  gameId,
  defaultValue,
}: UseDailyLocalTodayPropsV2<TLocal>) {
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
