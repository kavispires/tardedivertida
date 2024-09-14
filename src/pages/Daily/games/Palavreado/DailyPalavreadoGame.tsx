import './utils/styles.scss';

import { useCurrentUserContext } from 'hooks/useCurrentUserContext';
import { DailyError } from 'pages/Daily/components/DailyError';
import { DailyLoading } from 'pages/Daily/components/DailyLoading';

import { useDailyChallenge } from '../../hooks/useDailyChallenge';
import { getToday } from '../../utils';
import { DailyPalavreado } from './components/DailyPalavreado';

export function DailyPalavreadoGame() {
  const { currentUser } = useCurrentUserContext();

  // Load challenge
  const challengeQuery = useDailyChallenge(getToday());

  if (challengeQuery.isLoading) {
    return <DailyLoading />;
  }
  const dailyData = challengeQuery?.data?.['palavreado'];

  if (challengeQuery.isError || !dailyData) {
    return <DailyError />;
  }

  return <DailyPalavreado data={dailyData} currentUser={currentUser} />;
}
