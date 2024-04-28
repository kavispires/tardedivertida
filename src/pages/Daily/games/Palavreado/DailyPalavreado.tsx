import './utils/styles.scss';

import { PageError } from 'components/errors';

import { useCurrentUserContext } from 'hooks/useCurrentUserContext';

import { DailyChrome } from '../../components/DailyChrome';
import { useDailyChallenge } from '../../hooks/useDailyChallenge';
import { getToday } from '../../utils';
import { DailyPalavreado } from './components/DailyPalavreado';
import { DailyLoading } from 'pages/Daily/components/DailyLoading';
import { useWordList } from './data/useWordList';

export function DailyPalavreadoGame() {
  const { currentUser } = useCurrentUserContext();
  const today = getToday();

  // Load challenge
  const challengeQuery = useDailyChallenge(`${today}`);
  const wordListQuery = useWordList();

  if (wordListQuery.isLoading || challengeQuery.isLoading) {
    return <DailyLoading />;
  }

  const dailyData = challengeQuery?.data?.['palavreado'];

  if (challengeQuery.isError || wordListQuery.isError || !dailyData) {
    return (
      <DailyChrome>
        <PageError />
      </DailyChrome>
    );
  }

  return <DailyPalavreado data={dailyData} currentUser={currentUser} wordList={wordListQuery.data ?? []} />;
}
