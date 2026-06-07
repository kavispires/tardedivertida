import { useSelector } from '@tanstack/react-store';
import { Store } from '@tanstack/store';
import { useEffect } from 'react';
// Utils
import { getToday } from 'utils/helpers';
// Internal
import { ALL_SETTINGS } from '../utils/settings';
import { updateStreak } from '../utils/streakManager';
import { composeLocalTodayKey } from '../utils';

type DailyPlayerTracker = {
  // A game route
  [key: string]: string | 'unplayed' | null;
};

const STORAGE_KEY = 'TD_DAILY_PLAY_TRACKER';

/**
 * Legacy composes a local played key for the daily feature.
 * @param key - The key to compose the local played key for.
 * @returns The composed local played key.
 */
export const composeLocalPlayedKey = (key: string) => `TD_DAILY_${key}_LOCAL_PLAYED`;

/**
 * Load preferences from localStorage at module load time
 */
const getInitialStoreState = (): DailyPlayerTracker => {
  const initialState = Object.values(ALL_SETTINGS).reduce((acc, setting) => {
    acc[setting.KEY] = 'unplayed';
    return acc;
  }, {} as DailyPlayerTracker);

  if (typeof window === 'undefined') {
    return initialState;
  }

  let storedLocalStorage: DailyPlayerTracker = {};
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    storedLocalStorage = JSON.parse(stored ?? '{}');

    if (!storedLocalStorage || typeof storedLocalStorage !== 'object') {
      window.localStorage.removeItem(STORAGE_KEY);
      storedLocalStorage = {};
    }
  } catch (error) {
    // biome-ignore lint/suspicious/noConsole: error logging
    console.error('Failed to parse daily play tracker from localStorage:', error);
    window.localStorage.removeItem(STORAGE_KEY);
    storedLocalStorage = {};
  }

  try {
    const today = getToday();
    const state = Object.keys(initialState).reduce((acc, key) => {
      // If key is present and date matches get today, keep the value

      if (storedLocalStorage[key] === today) {
        acc[key] = today; // Mark as played
        return acc;
      }

      // If value is 'unplayed', check LEGACY keys and update accordingly
      if (!storedLocalStorage[key] || storedLocalStorage[key] === 'unplayed') {
        const legacyPlayedKey = composeLocalPlayedKey(key);
        const localKey = composeLocalTodayKey(key);

        let session: unknown & { id?: string } = {};
        let playedOn = 'unplayed';

        try {
          playedOn = localStorage.getItem(legacyPlayedKey) || 'unplayed';
        } catch {
          // Legacy key corrupted, ignore
        }

        try {
          session = JSON.parse(localStorage.getItem(localKey) || '{}');
        } catch {
          // Legacy key corrupted, ignore
        }
        const isToday = session?.id === today;

        // Delete legacy keys to clean up storage
        localStorage.removeItem(legacyPlayedKey);

        if (isToday && playedOn === today) {
          acc[key] = today; // Mark as played
          return acc;
        }
      }

      // Otherwise, reset to 'unplayed'
      acc[key] = 'unplayed';
      return acc;
    }, {} as DailyPlayerTracker);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));

    return state;
  } catch (error) {
    // biome-ignore lint/suspicious/noConsole: error logging
    console.error('Failed to parse daily play tracker from localStorage:', error);

    window.localStorage.removeItem(STORAGE_KEY);
    return initialState;
  }
};

// Initialize store with data from localStorage at module load
const dailyPlayTrackerStore = new Store<DailyPlayerTracker>(getInitialStoreState());

/**
 * Updates the play status of a specific game key to 'played' for today.
 */
export function useDailyPlayTracker() {
  const store = useSelector(dailyPlayTrackerStore, (state) => state);
  const today = getToday();

  // Verifier to check if the game was played today (match date or not)
  const checkWasPlayedToday = (key: string): boolean => {
    const playedKeyValue = store[key];
    return playedKeyValue === today;
  };

  const markAsPlayed = (key: string) => {
    const newState = { ...store, [key]: today };
    dailyPlayTrackerStore.setState(() => newState);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));

    // Update streak
    updateStreak(key, today);
  };

  const resetPlayStatus = (key: string, date?: string) => {
    const newState = { ...store, [key]: date ?? 'unplayed' };
    dailyPlayTrackerStore.setState(() => newState);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
  };

  return {
    playedStatus: store,
    checkWasPlayedToday,
    markAsPlayed,
    resetPlayStatus,
  };
}

/**
 * Marks a key as played if it is complete and updates the daily streak.
 * @param key - The key to mark as played.
 * @param isComplete - Whether the key is complete.
 */
export function useMarkAsPlayed({ key, isComplete }: { key: string; isComplete: boolean }) {
  const { checkWasPlayedToday, markAsPlayed } = useDailyPlayTracker();

  // biome-ignore lint/correctness/useExhaustiveDependencies: no functions
  useEffect(() => {
    const wasPlayedToday = checkWasPlayedToday(key);

    if (!wasPlayedToday && isComplete) {
      // Mark as played
      markAsPlayed(key);
    }
  }, [isComplete, key]);
}

const LEGACY_LS_KEYS = [
  'TD_DAILY_GAMES',
  'TD_DAILY_COMUNICACAO_ALIENIGENA_LOCAL_PLAYED',
  'TD_DAILY_COMUNICACAO_ALIENIGENA_LOCAL_TODAY',
  'TD_DAILY_CONTROLE_DE_ESTOQUE_LOCAL_PLAYED',
  'TD_DAILY_CONTROLE_DE_ESTOQUE_LOCAL_TODAY',
  'TD_DAILY_DETECTIVE_LOCAL_PLAYED',
  'TD_DAILY_DETECTIVE_LOCAL_TODAY',
  'TD_DAILY_ESPIONAGEM_LOCAL_PLAYED',
  'TD_DAILY_ESPIONAGEM_LOCAL_TODAY',
  'TD_DAILY_PORTAIS_MAGICOS_LOCAL_PLAYED',
  'TD_DAILY_PORTAIS_MAGICOS_LOCAL_TODAY',
  'TD_DAILY_PRECONCEITO_LOCAL_PLAYED',
  'TD_DAILY_PRECONCEITO_LOCAL_TODAY',
  'TD_DAILY_TEORIA_DE_CONJUNTOS_LOCAL_PLAYED',
  'TD_DAILY_TEORIA_DE_CONJUNTOS_LOCAL_TODAY',
  'TD_DAILY_VITRAIS_LOCAL_PLAYED',
  'TD_DAILY_VITRAIS_LOCAL_TODAY',
  'TD_DAILY_rules-open',
  'endless-vitrais-last-day',
  'endless-vitrais-pieces-index',
  'TD_DAILY_vitraisinfinitos_LOCAL_PLAYED',
  'TD_DAILY__LOCAL_PLAYED',
];

(function cleanUpLegacyLocalStorage() {
  if (typeof window === 'undefined') {
    return;
  }

  LEGACY_LS_KEYS.forEach((key) => {
    window.localStorage.removeItem(key);
  });
})();
