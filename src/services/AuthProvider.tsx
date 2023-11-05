import { ReactNode, createContext, useState } from 'react';
import { auth } from './firebase';
import type { User } from 'firebase/auth';
import { useQuery } from 'react-query';
import { useEffectOnce } from 'react-use';
import { App } from 'antd';
import { USER_API, USER_API_ACTIONS } from './adapters';
// Utils
import { print } from 'utils/helpers';
// Hooks
import { useLoading } from 'hooks/useLoading';
import { useLanguage } from 'hooks/useLanguage';
import { useGlobalState } from 'hooks/useGlobalState';
import { getToday } from 'pages/Daily/utils';

const PLACEHOLDER_GAME_USER_ENTRY = {
  gameId: '',
  startedAt: 0,
  endedAt: 0,
  playerCount: 0,
  placement: 0,
  achievements: [],
};

const DEFAULT_ME_DATA: Me = {
  id: 'anonymous',
  isAdmin: false,
  names: [],
  avatars: [],
  language: 'en',
  statistics: {
    plays: 0,
    uniqueGamesPlayed: 0,
    winnableGames: 0,
    win: 0,
    last: 0,
    achievements: 0,
    totalPlayDuration: 0,
    latestPlay: PLACEHOLDER_GAME_USER_ENTRY,
    shortestPlay: PLACEHOLDER_GAME_USER_ENTRY,
    longestPlay: PLACEHOLDER_GAME_USER_ENTRY,
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
  daily: {
    total: 0,
    longestStreak: 0,
    streak: 0,
  },
};

export const AuthContext = createContext<{
  currentUser: Me;
  isLoading: boolean;
  isAdmin: boolean;
  isAuthenticated: boolean;
  isGuest: boolean;
}>({
  currentUser: DEFAULT_ME_DATA,
  isLoading: true,
  isAdmin: false,
  isAuthenticated: false,
  isGuest: false,
});

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [authenticatedUser, setAuthenticatedUser] = useState<User | null>(null);
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
    });
  });

  const defaultData = {
    ...DEFAULT_ME_DATA,
    id: authenticatedUser?.uid ?? 'anonymous',
  };

  const { setLoader } = useLoading();
  const isAuthenticated = Boolean(authenticatedUser);

  // Game gameID
  const query = useQuery<any>({
    queryKey: ['user'],
    queryFn: async () => {
      console.count('Fetching user...');
      return await USER_API.run({ action: USER_API_ACTIONS.GET_USER, date: getToday() });
    },
    enabled: isAuthenticated,
    retry: false,
    onSuccess: (response) => {
      const data = response.data as Me;
      print({ me: data }, 'table');
    },
    onError: (e: any) => {
      if (!authenticatedUser?.isAnonymous) {
        console.error(e);
        notification.error({
          message: 'Failed to load user',
          description: JSON.stringify(e.message),
        });
      }
    },
    onSettled: () => {
      setLoader('user', false);
    },
  });

  const firestoreUser = query.data?.data ?? defaultData;

  return (
    <AuthContext.Provider
      value={{
        currentUser: firestoreUser,
        isLoading: isLoading || (isAuthenticated && query.isLoading),
        isAdmin: Boolean(firestoreUser.isAdmin),
        isAuthenticated,
        isGuest: Boolean(authenticatedUser?.isAnonymous),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
