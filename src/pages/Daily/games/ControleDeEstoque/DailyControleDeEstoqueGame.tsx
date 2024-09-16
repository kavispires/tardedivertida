import { DailyError } from 'pages/Daily/components/DailyError';
import { DailyLoading } from 'pages/Daily/components/DailyLoading';
import { useDailyChallenge } from 'pages/Daily/hooks/useDailyChallenge';
// Hooks
import { useCurrentUserContext } from 'hooks/useCurrentUserContext';
// Internal
import { DailyControleDeEstoque } from './components/DailyControleDeEstoque';
// Sass
import './utils/styles.scss';

export function DailyControleDeEstoqueGame() {
  const { currentUser } = useCurrentUserContext();

  // Load challenge
  const challengeQuery = useDailyChallenge();

  if (challengeQuery.isLoading) {
    return <DailyLoading />;
  }
  const dailyData = challengeQuery?.data?.['controle-de-estoque'];

  if (challengeQuery.isError || !dailyData) {
    return <DailyError />;
  }

  return <DailyControleDeEstoque data={dailyData} currentUser={currentUser} />;
}
