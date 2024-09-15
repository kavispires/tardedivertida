import { DailyError } from 'pages/Daily/components/DailyError';
import { DailyLoading } from 'pages/Daily/components/DailyLoading';
// Hooks
import { useCurrentUserContext } from 'hooks/useCurrentUserContext';
// Internal
import { DailyArteRuim } from './components/DailyArteRuim';
import { useDailyChallenge } from '../../hooks/useDailyChallenge';
// Sass
import './utils/styles.scss';

export function DailyArteRuimGame() {
  const { currentUser } = useCurrentUserContext();

  // Load challenge
  const challengeQuery = useDailyChallenge();

  if (challengeQuery.isLoading) {
    return <DailyLoading />;
  }

  const dailyData = challengeQuery?.data?.['arte-ruim'];

  if (challengeQuery.isError || !dailyData) {
    return <DailyError />;
  }

  return <DailyArteRuim data={dailyData} currentUser={currentUser} />;
}
