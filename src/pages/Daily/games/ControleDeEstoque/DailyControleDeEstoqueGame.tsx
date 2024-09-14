import './utils/styles.scss';

import { useCurrentUserContext } from 'hooks/useCurrentUserContext';
import { DailyError } from 'pages/Daily/components/DailyError';
import { DailyLoading } from 'pages/Daily/components/DailyLoading';
import { useDailyChallenge } from 'pages/Daily/hooks/useDailyChallenge';

import { getToday } from '../../utils';
import { DailyControleDeEstoque } from './components/DailyControleDeEstoque';

export function DailyControleDeEstoqueGame() {
  const { currentUser } = useCurrentUserContext();

  // Load challenge
  const challengeQuery = useDailyChallenge(getToday());

  if (challengeQuery.isLoading) {
    return <DailyLoading />;
  }
  const dailyData = challengeQuery?.data?.['controle-de-estoque'];

  if (challengeQuery.isError || !dailyData) {
    return <DailyError />;
  }

  return <DailyControleDeEstoque data={dailyData} currentUser={currentUser} />;
}
