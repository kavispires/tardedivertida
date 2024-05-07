import './utils/styles.scss';

import { useCurrentUserContext } from 'hooks/useCurrentUserContext';
import { sample } from 'lodash';
import { DailyError } from 'pages/Daily/components/DailyError';
import { DailyLoading } from 'pages/Daily/components/DailyLoading';
import { useMemo } from 'react';

import { useDailyChallenge } from '../../hooks/useDailyChallenge';
import { getToday } from '../../utils';
import { DailyPalavreado } from './components/DailyPalavreado';
import { SAMPLE } from './utils/sample-data';
import { print } from 'utils/helpers';

export function DailyPalavreadoGame() {
  const { currentUser } = useCurrentUserContext();

  // Load challenge
  const challengeQuery = useDailyChallenge(getToday());

  const dailyData = useMemo(() => {
    const response = sample(SAMPLE);
    print(response);

    return response;
  }, []);

  if (challengeQuery.isLoading) {
    return <DailyLoading />;
  }

  if (challengeQuery.isError || !dailyData) {
    return <DailyError />;
  }

  return <DailyPalavreado data={dailyData} currentUser={currentUser} />;
}
