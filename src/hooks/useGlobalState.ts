import { createGlobalState } from 'react-hooks-global-state';

type InitialState = {
  isLoading: boolean;
  loaders: PlainObject;
  appStartedAt: number;
  screenSize: number[];
  // Language
  language: 'pt' | 'en';
  // Meta
  gameId: string | null;
  gameName: string | null;
  gameMeta: PlainObject;
  // User/Player
  userId: string | null;
  username: string;
  userAvatarId: string;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isDebugEnabled: boolean;
  blurredCards: BooleanDictionary;
  blurEnabled: boolean;
  // Drawing Games
  canvasSize: number;
  // Espiao-entre-nos
  cache: PlainObject;
  // Retrato-Falado
  monsterOrientation: 'vertical' | 'horizontal';
};

const initialState: InitialState = {
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
  isDebugEnabled: false,
  blurredCards: {},
  blurEnabled: false,
  // Drawing games
  canvasSize: 0,
  // Espiao-entre-nos
  cache: {},
  // Retrato-Falado
  monsterOrientation: 'vertical',
};

const { useGlobalState, setGlobalState, getGlobalState } = createGlobalState(initialState);

export { setGlobalState, getGlobalState, useGlobalState };

export default useGlobalState;
