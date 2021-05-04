import { createGlobalState } from 'react-hooks-global-state';

const initialState = {
  isLoading: false,
  loaders: false,
  isAuthenticated: false,
  appStartedAt: Date.now(),
  // Meta
  gameId: null,
  gameName: null,
  gameMeta: {},
  me: '',
  myAvatar: '',
  isAdmin: false,
  // Arte-Ruim
  canvasSize: 250,
};

const { useGlobalState, setGlobalState, getGlobalState } = createGlobalState(initialState);

export { setGlobalState, getGlobalState, useGlobalState };

export default useGlobalState;
