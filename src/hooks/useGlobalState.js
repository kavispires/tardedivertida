import { createGlobalState } from 'react-hooks-global-state';

const initialState = {
  isLoading: false,
  loaders: false,
  appStartedAt: Date.now(),
  screenSize: [],
  // Language
  language: 'pt',
  // Meta
  gameId: null,
  gameName: null,
  gameMeta: {},
  // User/Player
  userId: null,
  username: '',
  userAvatarId: '',
  isAuthenticated: false,
  isAdmin: false,
  blurredCards: {},
  // Arte-Ruim
  canvasSize: 250,
  cachedCanvasSize: 250,
  // Espiao-entre-nos
  espiaoEntreNosCache: {},
};

const { useGlobalState, setGlobalState, getGlobalState } = createGlobalState(initialState);

export { setGlobalState, getGlobalState, useGlobalState };

export default useGlobalState;
