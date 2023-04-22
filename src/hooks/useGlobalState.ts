import { createGlobalState } from 'react-hooks-global-state';

type InitialState = {
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
