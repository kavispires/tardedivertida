import './utils/styles.scss';

import { useCurrentUserContext } from 'hooks/useCurrentUserContext';
import { DailyError } from 'pages/Daily/components/DailyError';
import { DailyLoading } from 'pages/Daily/components/DailyLoading';
import { getToday } from '../../utils';
import { DailyControleDeEstoque } from './components/DailyControleDeEstoque';
import { useControleDeEstoqueDemo } from './utils/useControleDeEstoqueDemo';

export function DailyControleDeEstoqueGame() {
  const { currentUser } = useCurrentUserContext();

  // Load challenge
  const challengeQuery = useControleDeEstoqueDemo(getToday());

  if (challengeQuery.isLoading || challengeQuery.isRefetching) {
    return <DailyLoading />;
  }
  const dailyData = challengeQuery?.data?.['controle-de-estoque'];

  if (challengeQuery.isError || !dailyData) {
    return <DailyError />;
  }

  return <DailyControleDeEstoque data={dailyData} currentUser={currentUser} />;
}
