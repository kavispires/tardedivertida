import { useQuery } from '@tanstack/react-query';
import type { User } from 'firebase/auth';
import { getToday } from 'pages/Daily/utils';
import { type ReactNode, createContext, useEffect, useState } from 'react';
import { useEffectOnce } from 'react-use';
// Ant Design Resources
import { App } from 'antd';
// Types
import type { Me } from 'types/user';
// Hooks
import { useGlobalState } from 'hooks/useGlobalState';
import { useLanguage } from 'hooks/useLanguage';
import { useLoading } from 'hooks/useLoading';
// Utils
import { print } from 'utils/helpers';
// Internal
import { auth } from './firebase';
import { USER_API, USER_API_ACTIONS } from './adapters';

const PLACEHOLDER_GAME_USER_ENTRY = {
  gameId: '',
  startedAt: 0,
  endedAt: 0,
  playerCount: 0,
  placement: 0,
  achievements: [],
  rating: null,
};

const DEFAULT_ME_DATA: Me = {
  id: 'anonymous',
  isAdmin: false,
  names: [],
  avatars: [],
  language: JSON.parse(localStorage.getItem('TD_language') || '"en"') || 'en',
  statistics: {
    plays: 0,
    uniqueGamesPlayed: 0,
    winnableGames: 0,
    win: 0,
    last: 0,
    achievements: 0,
    totalPlayDuration: 0,
    latestPlay: PLACEHOLDER_GAME_USER_ENTRY,
    firstPlay: PLACEHOLDER_GAME_USER_ENTRY,
    mostPlayedGame: '',
    leastPlayedGame: '',
    favoriteGame: '',
    leastFavoriteGame: '',
    bestAtGame: '',
    worstAtGame: '',
    averagePlayerCount: 0,
  },
  games: {},
  today: {
    plays: 0,
    last: 0,
    win: 0,
    achievements: 0,
    duration: 0,
    games: [],
  },
};

export const AuthContext = createContext<{
  currentUser: Me;
  isLoading: boolean;
  isAuthenticating: boolean;
  isAdmin: boolean;
  isAuthenticated: boolean;
  isGuest: boolean;
}>({
  currentUser: DEFAULT_ME_DATA,
  isLoading: true,
  isAuthenticating: true,
  isAdmin: false,
  isAuthenticated: false,
  isGuest: false,
});

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [authenticatedUser, setAuthenticatedUser] = useState<User | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const { translate } = useLanguage();
  const [, setUserId] = useGlobalState('userId');
  const { message, notification } = App.useApp();

  useEffectOnce(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setAuthenticatedUser(user);
        setUserId(user.uid);
        message.info(translate('Você está logado.', 'You are logged in'));
      } else {
        setAuthenticatedUser(null);
      }

      setIsLoading(false);
      setIsAuthenticating(false);
    });
  });

  const defaultData = {
    ...DEFAULT_ME_DATA,
    id: authenticatedUser?.uid ?? 'anonymous',
  };

  const { setLoader } = useLoading();
  const isAuthenticated = Boolean(authenticatedUser);

  // Game gameID
  const query = useQuery<Me>({
    queryKey: ['user'],
    queryFn: async () => {
      // biome-ignore lint/suspicious/noConsole: on purpose
      console.count('Fetching user...');
      const response = await USER_API.run({ action: USER_API_ACTIONS.GET_USER, date: getToday() });
      print({ me: response.data }, 'table');
      setLoader('user', false);
      return response.data as Me;
    },
    enabled: isAuthenticated,
    retry: false,
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: only an error should trigger
  useEffect(() => {
    if (!authenticatedUser?.isAnonymous && query.isError) {
      // biome-ignore lint/suspicious/noConsole: on purpose
      console.error(query.error);
      notification.error({
        message: 'Failed to load user',
        description: JSON.stringify(query.error.message),
      });
    }
  }, [query.isError]);

  const firestoreUser = query.data ?? defaultData;

  return (
    <AuthContext.Provider
      value={{
        currentUser: firestoreUser,
        isLoading: isLoading || (isAuthenticated && query.isLoading),
        isAuthenticating,
        isAdmin: Boolean(firestoreUser.isAdmin),
        isAuthenticated,
        isGuest: Boolean(authenticatedUser?.isAnonymous),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
