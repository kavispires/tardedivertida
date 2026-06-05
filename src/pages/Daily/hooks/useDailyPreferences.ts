import { useSelector } from '@tanstack/react-store';
import { Store } from '@tanstack/store';

type DailyPreferences = {
  /**
   * The challenge level of Aqui Ó
   */
  aquiOMode: 'challenge' | 'normal';
  /**
   * The voice setting for Aqui Ó
   */
  aquiOVoice: 'on' | 'off';
  /**
   * The mode for Ta Na Cara
   */
  taNaCaraMode: 'nsfw' | 'normal';
  /**
   * The date of the last news check
   */
  lastNewsCheck: string;
};

const initialState: DailyPreferences = {
  aquiOMode: 'normal',
  aquiOVoice: 'off',
  taNaCaraMode: 'normal',
  lastNewsCheck: '2000-01-01',
};

const STORAGE_KEY = 'TD_DAILY_PREFERENCES';

/**
 * Load preferences from localStorage at module load time
 */
const getInitialStoreState = (): DailyPreferences => {
  if (typeof window === 'undefined') {
    return initialState;
  }

  // TODO: Legacy, remove after transition period
  if (localStorage.getItem('daily-news')) {
    localStorage.removeItem('daily-news');
  }

  try {
    const storedPreferencesString = window.localStorage.getItem(STORAGE_KEY);
    if (!storedPreferencesString) {
      return initialState;
    }

    const storedPreferences = JSON.parse(storedPreferencesString) ?? {};
    const mergedState = { ...initialState, ...storedPreferences };

    return mergedState;
  } catch (error) {
    // biome-ignore lint/suspicious/noConsole: error logging
    console.error('Failed to parse daily preferences from localStorage:', error);
    return initialState;
  }
};

// Initialize store with data from localStorage at module load
const dailyPreferencesStore = new Store<DailyPreferences>(getInitialStoreState());

const setValue = <K extends keyof DailyPreferences>(property: K, value: DailyPreferences[K]) => {
  dailyPreferencesStore.setState((prev) => ({ ...prev, [property]: value }));
};

/**
 * Custom hook that provides a way to store and retrieve daily preferences in local storage.
 * Returns a tuple similar to useState: [value, setValue]
 *
 * @template K - The type of the property to be stored in the preferences.
 * @param property - The preference property to be accessed.
 * @returns A tuple containing the current value and a setter function to update the value.
 *
 * @example
 * const [aquiOMode, setAquiOMode] = usePreference('aquiOMode');
 */
export function usePreference<K extends keyof DailyPreferences>(property: K) {
  const { [property]: value } = useSelector(dailyPreferencesStore, (state) => state);

  const updateValue = (newValue: DailyPreferences[K]) => {
    // Update store
    setValue(property, newValue);

    // Get current preferences from localStorage
    const currentPreferencesString = window.localStorage.getItem(STORAGE_KEY);
    const currentPreferences = currentPreferencesString ? JSON.parse(currentPreferencesString) : {};

    // Update with new value
    const updatedPreferences = { ...currentPreferences, [property]: newValue };

    // Save back to localStorage
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPreferences));
  };

  return [value, updateValue] as const;
}
