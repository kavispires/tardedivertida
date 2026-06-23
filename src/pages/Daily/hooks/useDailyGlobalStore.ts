import { useSelector } from '@tanstack/react-store';
import { Store } from '@tanstack/store';
// Utils
import { getToday } from '@utils/helpers';

/**
 * Global state for the Daily game with values that should be shared across components during the daily session.
 */
type InitialState = {
  /**
   * Today's date in YYYY-MM-DD format
   */
  today: string;
  /**
   * Whether the rules modal is open
   */
  rulesOpen: boolean;
};

const initialState: InitialState = {
  today: getToday(),
  rulesOpen: false,
};

const dailyGlobalStore = new Store<InitialState>(initialState);

/**
 * Sets a specific property in the daily global state.
 */
export const setDailyGlobalStore = <K extends keyof InitialState>(property: K, value: InitialState[K]) => {
  dailyGlobalStore.setState((prev) => ({ ...prev, [property]: value }));
};

/**
 * Hook to access and update a specific property in the daily global state.
 * Returns a tuple with the current value and a setter function.
 */
export const useDailyGlobalStore = <K extends keyof InitialState>(property: K) => {
  const { [property]: value } = useSelector(dailyGlobalStore, (state) => state);

  return [value, (newValue: InitialState[K]) => setDailyGlobalStore(property, newValue)] as const;
};

/**
 * Resets all properties in the daily global state to their initial values.
 */
export const resetDailyGlobalStore = () => {
  setDailyGlobalStore('today', initialState.today);
  setDailyGlobalStore('rulesOpen', initialState.rulesOpen);
};
