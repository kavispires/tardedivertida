import './utils/styles.scss';

import { useCurrentUserContext } from 'hooks/useCurrentUserContext';
import { DailyError } from 'pages/Daily/components/DailyError';
import { DailyLoading } from 'pages/Daily/components/DailyLoading';

import { getToday } from '../../utils';
import { DailyTeoriaDeConjuntos } from './components/DailyTeoriaDeConjuntos';
import { useTeoriaDeConjuntosDemo } from './utils/useTeoriaDeConjuntosDemo';
import { useDailyChallenge } from 'pages/Daily/hooks/useDailyChallenge';

export function DailyTeoriaDeConjuntosGame() {
  const { currentUser } = useCurrentUserContext();

  // Load challenge
  // TODO: Remove demo query
  const today = getToday();
  const demoQuery = useTeoriaDeConjuntosDemo(today);
  const realQuery = useDailyChallenge(today);
  const challengeQuery = today === '2024-08-31' ? demoQuery : realQuery;

  if (challengeQuery.isLoading || challengeQuery.isRefetching) {
    return <DailyLoading />;
  }
  const dailyData = challengeQuery?.data?.['teoria-de-conjuntos'];

  if (challengeQuery.isError || !dailyData) {
    return <DailyError />;
  }

  return <DailyTeoriaDeConjuntos data={dailyData} currentUser={currentUser} />;
}
