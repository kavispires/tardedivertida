import { createGlobalState } from 'react-hooks-global-state';

const initialState = {
  isLoading: false,
  loaders: {},
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
  blurEnabled: false,
  // Arte-Ruim
  canvasSize: 0,
  // Espiao-entre-nos
  espiaoEntreNosCache: {},
};

const { useGlobalState, setGlobalState, getGlobalState } = createGlobalState(initialState);

export { setGlobalState, getGlobalState, useGlobalState };

export default useGlobalState;
