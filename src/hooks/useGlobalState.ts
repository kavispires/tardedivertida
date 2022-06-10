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
  gameMeta: GameMeta;
  // User/Player
  userId: string | null;
  username: string;
  userAvatarId: string;
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
  gameMeta: {
    gameId: '',
    gameName: '',
    createdAt: 0,
    createdBy: '',
    isComplete: false,
    isLocked: false,
    language: 'en',
    max: 0,
    min: 0,
    replay: 0,
  },
  // User/Player
  userId: null,
  username: '',
  userAvatarId: '',
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
};

const { useGlobalState, setGlobalState, getGlobalState } = createGlobalState(initialState);

function resetGlobalState() {
  setGlobalState('gameId', initialState.gameId);
  setGlobalState('gameName', initialState.gameName);
  setGlobalState('gameMeta', initialState.gameMeta);
  setGlobalState('userId', initialState.userId);
  setGlobalState('username', initialState.username);
  setGlobalState('userAvatarId', initialState.userAvatarId);
}
export { setGlobalState, getGlobalState, useGlobalState, resetGlobalState };

export default useGlobalState;
