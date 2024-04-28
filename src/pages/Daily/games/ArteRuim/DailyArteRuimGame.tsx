import './utils/styles.scss';

import { PageError } from 'components/errors';
import { useCurrentUserContext } from 'hooks/useCurrentUserContext';

import { DailyChrome } from '../../components/DailyChrome';
import { useDailyChallenge } from '../../hooks/useDailyChallenge';
import { getToday } from '../../utils';
import { DailyArteRuim } from './components/DailyArteRuim';
import { DailyLoading } from 'pages/Daily/components/DailyLoading';
import { DailyError } from 'pages/Daily/components/DailyError';

export function DailyArteRuimGame() {
  const { currentUser } = useCurrentUserContext();
  const today = getToday();

  // Load challenge
  const challengeQuery = useDailyChallenge(`${today}`);

  if (challengeQuery.isLoading) {
    return <DailyLoading />;
  }

  const dailyData = challengeQuery?.data?.['arte-ruim'];

  if (challengeQuery.isError || !dailyData) {
    return <DailyError />;
  }

  return <DailyArteRuim data={dailyData} currentUser={currentUser} />;
}
