import { useStore } from '@tanstack/react-store';
import { Store } from '@tanstack/store';
// Types
import type { GamePlayer } from 'types/player';
// Utils
import { PLACEHOLDER_PLAYER } from 'utils/constants';

/**
 * Global state for the app with value that should be shared across components during the duration of the app.
 * Anything persistent though sessions should be stored with useLocalStorage.
 */
type InitialState = {
  appStartedAt: number;
  showPlayersBar: boolean;
  // User/Player
  userId: string | null;
  username: string;
  userAvatarId: string;
  user: GamePlayer;
  isAdminEnabled: boolean;
  isDebugEnabled: boolean;
  // Retrato-Falado
  monsterOrientation: 'vertical' | 'horizontal';
  // Dev
  usingFirestoreEmulator: false | string;
  usingFunctionsEmulator: false | string;
};

const initialState: InitialState = {
  appStartedAt: Date.now(),
  showPlayersBar: true,
  // User/Player
  userId: null,
  username: '',
  userAvatarId: '',
  user: PLACEHOLDER_PLAYER,
  isAdminEnabled: true,
  isDebugEnabled: false,
  // Retrato-Falado
  monsterOrientation: 'vertical',
  // Dev
  usingFirestoreEmulator: false,
  usingFunctionsEmulator: false,
};

const globalStore = new Store<InitialState>(initialState);

export const setGlobalState = <K extends keyof InitialState>(property: K, value: InitialState[K]) => {
  globalStore.setState((prev) => ({ ...prev, [property]: value }));
};

export const useGlobalState = <K extends keyof InitialState>(property: K) => {
  const { [property]: value } = useStore(globalStore, () => globalStore.state);

  return [value, (newValue: InitialState[K]) => setGlobalState(property, newValue)] as const;
};

export const resetGlobalState = () => {
  setGlobalState('userId', initialState.userId);
  setGlobalState('username', initialState.username);
  setGlobalState('userAvatarId', initialState.userAvatarId);
};
