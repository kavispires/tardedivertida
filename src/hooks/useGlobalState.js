import { createGlobalState } from 'react-hooks-global-state';

const initialState = {
  isLoading: false,
  loaders: false,
  isAuthenticated: false,
  appStartedAt: Date.now(),
  gameId: null,
  gameName: null,
  createdAt: null,
  me: '',
  myAvatar: '',
  isAdmin: false,
};

const { useGlobalState, setGlobalState, getGlobalState } = createGlobalState(initialState);

export { setGlobalState, getGlobalState, useGlobalState };

export default useGlobalState;
