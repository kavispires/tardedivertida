import { DailyError } from 'pages/Daily/components/DailyError';
import { DailyLoading } from 'pages/Daily/components/DailyLoading';
// Hooks
import { useCurrentUserContext } from 'hooks/useCurrentUserContext';
// Internal
import { DailyFilmaco } from './components/DailyFilmaco';
import { useDailyChallenge } from '../../hooks/useDailyChallenge';
import { getToday } from '../../utils';
// Sass
import './utils/styles.scss';

export function DailyFilmacoGame() {
  const { currentUser } = useCurrentUserContext();
  const today = getToday();

  // Load challenge
  const challengeQuery = useDailyChallenge(`${today}`);

  if (challengeQuery.isLoading) {
    return <DailyLoading />;
  }

  const dailyData = challengeQuery?.data?.['filmaco'];

  if (challengeQuery.isError || !dailyData) {
    return <DailyError />;
  }

  return <DailyFilmaco data={dailyData} currentUser={currentUser} />;
}
