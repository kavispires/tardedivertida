import { createGlobalState } from 'react-hooks-global-state';

const initialState = {
  isLoading: false,
  loaders: false,
  isAuthenticated: false,
  appStartedAt: Date.now(),
  screenSize: [],
  // Meta
  gameId: null,
  gameName: null,
  gameMeta: {},
  // User/Player
  userId: null,
  username: '',
  userAvatarId: '',
  isAdmin: false,
  // Arte-Ruim
  canvasSize: 250,
  cachedCanvasSize: 250,
  // Espiao-entre-nos
  espiaoEntreNosCache: {},
};

const { useGlobalState, setGlobalState, getGlobalState } = createGlobalState(initialState);

export { setGlobalState, getGlobalState, useGlobalState };

export default useGlobalState;
