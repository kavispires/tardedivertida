import { DailyError } from 'pages/Daily/components/DailyError';
import { DailyLoading } from 'pages/Daily/components/DailyLoading';
import { useDailyChallenge } from 'pages/Daily/hooks/useDailyChallenge';
// Hooks
import { useCurrentUserContext } from 'hooks/useCurrentUserContext';
// Internal
import { DailyTeoriaDeConjuntos } from './components/DailyTeoriaDeConjuntos';
// Sass
import './utils/styles.scss';

export function DailyTeoriaDeConjuntosGame() {
  const { currentUser } = useCurrentUserContext();

  // Load challenge
  const challengeQuery = useDailyChallenge();

  if (challengeQuery.isLoading || challengeQuery.isRefetching) {
    return <DailyLoading />;
  }
  const dailyData = challengeQuery?.data?.['teoria-de-conjuntos'];

  if (challengeQuery.isError || !dailyData) {
    return <DailyError />;
  }

  return <DailyTeoriaDeConjuntos data={dailyData} currentUser={currentUser} />;
}
