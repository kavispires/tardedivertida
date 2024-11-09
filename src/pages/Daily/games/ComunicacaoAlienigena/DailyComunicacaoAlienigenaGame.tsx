import { DailyError } from 'pages/Daily/components/DailyError';
import { DailyLoading } from 'pages/Daily/components/DailyLoading';
import { useDailyChallenge } from 'pages/Daily/hooks/useDailyChallenge';
// Hooks
import { useCurrentUserContext } from 'hooks/useCurrentUserContext';
// Internal
import { useComunicacaoAlienigenaDemo } from './utils/useComunicacaoAlienigenaDemo';
import { DailyComunicacaoAlienigena } from './components/DailyComunicacaoAlienigena';
// Sass
import './utils/styles.scss';

export function DailyComunicacaoAlienigenaGame() {
  const { currentUser } = useCurrentUserContext();

  // Load challenge
  const challengeQuery = useDailyChallenge();
  const demo = useComunicacaoAlienigenaDemo();

  if (challengeQuery.isLoading || demo.isLoading) {
    return <DailyLoading />;
  }

  const dailyData = challengeQuery?.data?.['comunicacao-alienigena'];
  const demoData = demo?.data;

  if (challengeQuery.isError || (!dailyData && !demoData)) {
    return <DailyError />;
  }

  if (dailyData) {
    return <DailyComunicacaoAlienigena data={dailyData} currentUser={currentUser} />;
  }

  if (!demoData) {
    return <DailyError />;
  }

  return <DailyComunicacaoAlienigena key={demoData.id} data={demoData} currentUser={currentUser} />;
}
