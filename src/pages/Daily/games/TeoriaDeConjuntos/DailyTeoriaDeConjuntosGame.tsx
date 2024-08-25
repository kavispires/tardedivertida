import './utils/styles.scss';

import { useCurrentUserContext } from 'hooks/useCurrentUserContext';
import { DailyError } from 'pages/Daily/components/DailyError';
import { DailyLoading } from 'pages/Daily/components/DailyLoading';

import { getToday } from '../../utils';
import { DailyTeoriaDeConjuntos } from './components/DailyTeoriaDeConjuntos';
import { useTeoriaDeConjuntosDemo } from './utils/useTeoriaDeConjuntosDemo';

export function DailyTeoriaDeConjuntosGame() {
  const { currentUser } = useCurrentUserContext();

  // Load challenge
  const challengeQuery = useTeoriaDeConjuntosDemo(getToday());

  if (challengeQuery.isLoading || challengeQuery.isRefetching) {
    return <DailyLoading />;
  }
  const dailyData = challengeQuery?.data?.['teoria-de-conjuntos'];

  if (challengeQuery.isError || !dailyData) {
    return <DailyError />;
  }

  return <DailyTeoriaDeConjuntos data={dailyData} currentUser={currentUser} />;
}
