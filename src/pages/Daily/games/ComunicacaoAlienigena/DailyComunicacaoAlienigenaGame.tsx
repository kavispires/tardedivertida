import { DailyError } from 'pages/Daily/components/DailyError';
import { DailyLoading } from 'pages/Daily/components/DailyLoading';
// Hooks
import { useCurrentUserContext } from 'hooks/useCurrentUserContext';
// Internal
import { useComunicacaoAlienigenaDemo } from './utils/useComunicacaoAlienigenaDemo';
import { DailyComunicacaoAlienigena } from './components/DailyComunicacaoAlienigena';
// Sass
import './utils/styles.scss';
// Internal

export function DailyComunicacaoAlienigenaGame() {
  const { currentUser } = useCurrentUserContext();

  // Load challenge
  const challengeQuery = useComunicacaoAlienigenaDemo();

  if (challengeQuery.isLoading) {
    return <DailyLoading />;
  }

  const dailyData = challengeQuery?.data;

  if (challengeQuery.isError || !dailyData) {
    return <DailyError />;
  }

  return <DailyComunicacaoAlienigena data={dailyData} currentUser={currentUser} />;
}
