import { DailyError } from 'pages/Daily/components/DailyError';
import { DailyLoading } from 'pages/Daily/components/DailyLoading';
// Hooks
import { useCurrentUserContext } from 'hooks/useCurrentUserContext';
// Internal
import { DailyPicaco } from './components/DailyPicaco';
import { useDailyChallenge } from '../../hooks/useDailyChallenge';
// Sass
import './utils/styles.scss';

export function DailyPicacoGame() {
  const { currentUser, isLoading } = useCurrentUserContext();

  // Load challenge
  const challengeQuery = useDailyChallenge();

  if (challengeQuery.isLoading || isLoading) {
    return <DailyLoading />;
  }

  const dailyData = challengeQuery?.data?.['artista'];

  if (challengeQuery.isError || !dailyData) {
    return <DailyError />;
  }

  return <DailyPicaco data={dailyData} currentUser={currentUser} />;
}
