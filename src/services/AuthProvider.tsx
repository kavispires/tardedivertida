import { ReactNode, createContext, useContext, useState } from 'react';
import { auth } from './firebase';
import type { User } from 'firebase/auth';
import { useQuery } from 'react-query';
import { useLoading } from 'hooks/useLoading';
import { GAME_API } from './adapters';
import { message, notification } from 'antd';
import { print } from 'utils/helpers';
import { useEffectOnce } from 'react-use';
import { useLanguage } from 'hooks/useLanguage';

const DEFAULT_ME_DATA: Me = {
  id: 'anonymous',
  isAdmin: false,
  names: [],
  avatars: [],
  statistics: {
    gamesPlayed: 0,
    uniqueGamesPlayed: 0,
    winnableGames: 0,
    win: 0,
    last: 0,
    achievements: 0,
    lastPlay: 0,
    totalPlayDuration: 0,
  },
  games: {},
};

export const AuthContext = createContext<{
  currentUser: Me;
  isLoading: boolean;
  isAdmin: boolean;
  isAuthenticated: boolean;
}>({
  currentUser: DEFAULT_ME_DATA,
  isLoading: true,
  isAdmin: false,
  isAuthenticated: false,
});

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [authenticatedUser, setAuthenticatedUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { translate } = useLanguage();

  useEffectOnce(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setAuthenticatedUser(user);
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
    queryKey: 'user',
    queryFn: async () => {
      console.count('Fetching user...');
      return await GAME_API.getUser();
    },
    enabled: isAuthenticated,
    retry: false,
    onSuccess: (response) => {
      const data = response.data as Me;
      print({ me: data }, 'table');
    },
    onError: (e: any) => {
      console.error(e);
      notification.error({
        message: 'Failed to load user',
        description: JSON.stringify(e.message),
      });
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
        isLoading: isLoading || query.isLoading,
        isAdmin: Boolean(firestoreUser.isAdmin),
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useCurrentUserContext = () => useContext(AuthContext);
