import './utils/styles.scss';

import { useCurrentUserContext } from 'hooks/useCurrentUserContext';
import { DailyError } from 'pages/Daily/components/DailyError';
import { DailyLoading } from 'pages/Daily/components/DailyLoading';

import { useDailyChallenge } from '../../hooks/useDailyChallenge';
import { getToday } from '../../utils';
import { DailyFilmaco } from './components/DailyFilmaco';
import { useMemo } from 'react';
import { DEMO_DATA } from './data/demo';
import { DailyFilmacoEntry } from './utils/types';

export function DailyFilmacoGame() {
  const { currentUser } = useCurrentUserContext();
  const today = getToday();

  // Load challenge
  const challengeQuery = useDailyChallenge(`${today}`);

  const dailyDataFR = challengeQuery?.data?.['filmaco'];

  const fallbackDailyData: DailyFilmacoEntry = useMemo(() => {
    const entry = DEMO_DATA[3];
    return {
      id: today,
      number: 0,
      type: 'filmaco',
      setId: entry?.id ?? '',
      title: entry?.title ?? '',
      itemsIds: entry?.itemsIds ?? [],
      year: entry?.year ?? 2024,
    };
  }, [today]);

  if (challengeQuery.isLoading) {
    return <DailyLoading />;
  }

  const dailyData = dailyDataFR || fallbackDailyData;

  if (challengeQuery.isError || !dailyData) {
    return <DailyError />;
  }

  return <DailyFilmaco data={dailyData} currentUser={currentUser} />;
}
