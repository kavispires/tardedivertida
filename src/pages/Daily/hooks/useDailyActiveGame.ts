import { useSelector } from '@tanstack/react-store';
import { Store } from '@tanstack/store';
// Utils
import { getToday } from 'utils/helpers';

type DailyActiveGame = {
  activeGame: string | null;
  activeDate: string | null;
};

const initialState: DailyActiveGame = {
  activeGame: null,
  activeDate: null,
};

const STORAGE_KEY = 'TD_DAILY_ACTIVE_GAME';

/**
 * Load preferences from localStorage at module load time
 */
const getInitialStoreState = (): DailyActiveGame => {
  if (typeof window === 'undefined') {
    return initialState;
  }

  try {
    const storedPreferencesString = window.localStorage.getItem(STORAGE_KEY);
    if (!storedPreferencesString) {
      return initialState;
    }

    const storedPreferences = JSON.parse(storedPreferencesString) ?? {};
    const mergedState = { ...initialState, ...storedPreferences };

    // Reset if the date has changed
    if (mergedState.activeDate !== getToday()) {
      mergedState.activeGame = null;
      mergedState.activeDate = getToday();
    }

    return mergedState;
  } catch (error) {
    // biome-ignore lint/suspicious/noConsole: error logging
    console.error('Failed to parse daily preferences from localStorage:', error);
    return initialState;
  }
};

// Initialize store with data from localStorage at module load
const dailyActiveGameStore = new Store<DailyActiveGame>(getInitialStoreState());

/**
 * Custom hook that manages the currently active daily game in local storage.
 * Automatically resets the active game when the date changes.
 */
export function useDailyActiveGame() {
  const { activeGame } = useSelector(dailyActiveGameStore, (state) => state);

  const updateValue = (newActiveGame: string) => {
    // Update store
    dailyActiveGameStore.setState((prev) => ({ ...prev, activeGame: newActiveGame, activeDate: getToday() }));

    // Get current preferences from localStorage
    const currentPreferencesString = window.localStorage.getItem(STORAGE_KEY);
    const currentPreferences = currentPreferencesString ? JSON.parse(currentPreferencesString) : {};

    // Update with new value
    const updatedPreferences = { ...currentPreferences, activeGame: newActiveGame, activeDate: getToday() };

    // Save back to localStorage
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPreferences));
  };

  return {
    activeGame,
    setActiveGame: updateValue,
  };
}
