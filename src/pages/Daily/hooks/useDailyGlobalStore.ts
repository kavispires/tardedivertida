import { useStore } from '@tanstack/react-store';
import { Store } from '@tanstack/store';
// Internal
import { getToday } from '../utils';

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
  /**
   * The currently active game identifier
   */
  activeGame: string | null;
};

const initialState: InitialState = {
  today: getToday(),
  rulesOpen: false,
  activeGame: null,
};

const dailyGlobalStore = new Store<InitialState>(initialState);

export const setDailyGlobalState = <K extends keyof InitialState>(property: K, value: InitialState[K]) => {
  dailyGlobalStore.setState((prev) => ({ ...prev, [property]: value }));
};

export const useDailyGlobalStore = <K extends keyof InitialState>(property: K) => {
  const { [property]: value } = useStore(dailyGlobalStore, () => dailyGlobalStore.state);

  return [value, (newValue: InitialState[K]) => setDailyGlobalState(property, newValue)] as const;
};

export const resetDailyGlobalState = () => {
  setDailyGlobalState('today', initialState.today);
  setDailyGlobalState('rulesOpen', initialState.rulesOpen);
  setDailyGlobalState('activeGame', initialState.activeGame);
};
