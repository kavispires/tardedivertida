import { createGlobalState } from 'react-hooks-global-state';

type InitialState = {
  isLoading: boolean;
  loaders: PlainObject;
  appStartedAt: number;
  screenSize: number[];
  showPlayersBar: boolean;
  // Language
  language: 'pt' | 'en';
  // User/Player
  userId: string | null;
  username: string;
  userAvatarId: string;
  user: GamePlayer;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isAdminEnabled: boolean;
  isDebugEnabled: boolean;
  blurredCards: BooleanDictionary;
  blurEnabled: boolean;
  // Sound
  volume: number;
  // Drawing Games
  canvasSize: number;
  // Espiao-entre-nos
  cache: PlainObject;
  // Retrato-Falado
  monsterOrientation: 'vertical' | 'horizontal';
  // Dev
  usingEmulators: boolean;
};

const initialState: InitialState = {
  isLoading: false,
  loaders: {},
  appStartedAt: Date.now(),
  screenSize: [],
  showPlayersBar: true,
  // Language
  language: 'pt',
  // User/Player
  userId: null,
  username: '',
  userAvatarId: '',
  user: {},
  isAuthenticated: false,
  isAdmin: false,
  isAdminEnabled: false,
  isDebugEnabled: false,
  blurredCards: {},
  blurEnabled: false,
  // Sound
  volume: 0.5,
  // Drawing games
  canvasSize: 0,
  // Espiao-entre-nos
  cache: {},
  // Retrato-Falado
  monsterOrientation: 'vertical',
  // Dev
  usingEmulators: false,
};

const { useGlobalState, setGlobalState, getGlobalState } = createGlobalState(initialState);

function resetGlobalState() {
  setGlobalState('userId', initialState.userId);
  setGlobalState('username', initialState.username);
  setGlobalState('userAvatarId', initialState.userAvatarId);
}
export { setGlobalState, getGlobalState, useGlobalState, resetGlobalState };
