import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import moment from 'moment';
import { createContext, type ReactNode, useContext } from 'react';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Services
import { DAILY_API, DAILY_API_ACTIONS } from 'services/adapters';
import { logAnalyticsEvent } from 'services/firebase';
// Utils
import { print } from 'utils/helpers';
// Internal
import type { DailyResponse } from '../utils/types';
import { getSourceName, getToday } from '../utils';

export type DailyContextType = Pick<
  UseQueryResult<DailyResponse, Error>,
  'isLoading' | 'data' | 'error' | 'isError' | 'isRefetching'
> & {
  itemsDictionary: Dictionary<string>;
};

const DailyContext = createContext<DailyContextType>({
  isLoading: false,
  data: undefined,
  error: null,
  isError: false,
  isRefetching: false,
  itemsDictionary: {},
});

type DailyContextProviderProps = {
  children: ReactNode;
};

const timeToMidnight = (() => {
  // Calculate time until midnight
  const now = moment();
  const midnight = moment().endOf('day');
  return midnight.diff(now); // Difference in milliseconds
})();

export const DailyContextProvider = ({ children }: DailyContextProviderProps) => {
  const { language } = useLanguage();
  const collectionName = getSourceName(language);

  // Load challenge
  const query = useQuery<DailyResponse>({
    queryKey: [collectionName, language],
    queryFn: async () => {
      // biome-ignore lint/suspicious/noConsole: debug purposes
      console.count(`Fetching ${collectionName}...`);
      const response = await DAILY_API.run({
        action: DAILY_API_ACTIONS.GET_DAILY,
        date: getToday(),
        document: collectionName,
      });
      const responseData = response.data as DailyResponse;
      print({ [collectionName]: responseData }, 'table');
      logAnalyticsEvent('daily_challenges_fetched');
      return responseData;
    },
    staleTime: timeToMidnight,
    gcTime: timeToMidnight,
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
        itemsDictionary: query.data?.dictionary ?? {},
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
