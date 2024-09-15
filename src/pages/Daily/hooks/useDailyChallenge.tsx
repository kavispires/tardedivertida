import { useQuery, UseQueryResult } from '@tanstack/react-query';
import moment from 'moment';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Services
import { DAILY_API, DAILY_API_ACTIONS } from 'services/adapters';
// Utils
import { print } from 'utils/helpers';
// Internal
import { DailyResponse } from '../utils/types';
import { getSourceName, getToday } from '../utils';
import { createContext, ReactNode, useContext } from 'react';

type DailyContextType = Pick<
  UseQueryResult<DailyResponse, Error>,
  'isLoading' | 'data' | 'error' | 'isError' | 'isRefetching'
>;

const DailyContext = createContext<DailyContextType>({
  isLoading: false,
  data: undefined,
  error: null,
  isError: false,
  isRefetching: false,
});

type DailyContextProviderProps = {
  children: ReactNode;
};

export const DailyContextProvider = ({ children }: DailyContextProviderProps) => {
  const { language } = useLanguage();
  const collectionName = getSourceName(language);

  // Load challenge
  const query = useQuery<DailyResponse>({
    queryKey: [collectionName, language],
    queryFn: async () => {
      console.count(`Fetching ${collectionName}...`);
      const response = await DAILY_API.run({
        action: DAILY_API_ACTIONS.GET_DAILY,
        date: getToday(),
        document: collectionName,
      });
      const responseData = response.data as DailyResponse;
      print({ [collectionName]: responseData }, 'table');
      return responseData;
    },
    staleTime: () => {
      // Calculate time until midnight
      const now = moment();
      const midnight = moment().endOf('day');
      return midnight.diff(now); // Difference in milliseconds
    },
    enabled: language === 'pt',
    retry: false,
  });

  return (
    <DailyContext.Provider
      value={{
        isLoading: query.isLoading,
        data: query.data,
        error: query.error,
        isError: query.isError,
        isRefetching: query.isRefetching,
      }}
    >
      {children}
    </DailyContext.Provider>
  );
};

export const useDailyChallenge = () => {
  const context = useContext(DailyContext);
  if (context === undefined) {
    throw new Error('useDailyChallenge must be used within a DailyContextProvider');
  }
  return context;
};
