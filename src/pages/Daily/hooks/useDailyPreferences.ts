import { useSelector } from '@tanstack/react-store';
import { Store } from '@tanstack/store';
import { useEffectOnce } from 'react-use';

type DailyPreferences = {
  aquiOMode: 'challenge' | 'normal';
  aquiOVoice: 'on' | 'off';
  taNaCaraMode: 'nsfw' | 'normal';
};

const initialState: DailyPreferences = {
  aquiOMode: 'normal',
  aquiOVoice: 'off',
  taNaCaraMode: 'normal',
};

const dailyPreferencesStore = new Store<DailyPreferences>(initialState);

const STORAGE_KEY = 'TD_DAILY_PREFERENCES';

let isInitialized = false;

/**
 * Load all preferences from localStorage into the store
 */
const initializePreferences = () => {
  if (isInitialized) return;

  const legacyPreferences: Partial<DailyPreferences> = {};
  // Legacy Settings Migration: copy old values, set to the new structure, and remove old keys
  try {
    const legacyAquiOMode = window.localStorage.getItem('TD_AQUI_DAILY_O_MODE');
    if (legacyAquiOMode) {
      legacyPreferences.aquiOMode = legacyAquiOMode === 'challenge' ? 'challenge' : 'normal';
      window.localStorage.removeItem('TD_AQUI_DAILY_O_MODE');
    }
    const legacyAquiOVoice = window.localStorage.getItem('TD_AQUI_DAILY_O_VOICE');
    if (legacyAquiOVoice) {
      legacyPreferences.aquiOVoice = legacyAquiOVoice === 'on' ? 'on' : 'off';
      window.localStorage.removeItem('TD_AQUI_DAILY_O_VOICE');
    }
    const legacyTaNaCaraMode = window.localStorage.getItem('TD_DAILY_TA_NA_CARA_MODE');
    if (legacyTaNaCaraMode) {
      legacyPreferences.taNaCaraMode = legacyTaNaCaraMode === 'nsfw' ? 'nsfw' : 'normal';
      window.localStorage.removeItem('TD_DAILY_TA_NA_CARA_MODE');
    }
  } catch (error) {
    // biome-ignore lint/suspicious/noConsole: error logging
    console.error('Failed to migrate legacy preferences:', error);
  }

  const storedPreferencesString = window.localStorage.getItem(STORAGE_KEY);
  if (storedPreferencesString) {
    try {
      const storedPreferences = JSON.parse(storedPreferencesString) ?? {};

      // Merge stored preferences with initial state
      const mergedState = { ...initialState, ...storedPreferences, ...legacyPreferences };

      dailyPreferencesStore.setState(mergedState);
      isInitialized = true;
    } catch (error) {
      // biome-ignore lint/suspicious/noConsole: error logging
      console.error('Failed to parse daily preferences from localStorage:', error);
    }
  } else {
    isInitialized = true;
  }
};

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

  // Initialize all preferences from localStorage on first hook call
  useEffectOnce(() => {
    initializePreferences();
  });

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
