import './utils/styles.scss';

import { useCurrentUserContext } from 'hooks/useCurrentUserContext';
import { DailyError } from 'pages/Daily/components/DailyError';
import { DailyLoading } from 'pages/Daily/components/DailyLoading';

import { useDailyChallenge } from '../../hooks/useDailyChallenge';
import { getToday } from '../../utils';
import { DailyPalavreado } from './components/DailyPalavreado';
import { useWordList } from './data/useWordList';
import { DailyPalavreadoEntry } from './utils/type';
import { sample } from 'lodash';

export function DailyPalavreadoGame() {
  const { currentUser } = useCurrentUserContext();
  const today = getToday();

  // Load challenge
  const challengeQuery = useDailyChallenge(`${today}`);
  const wordListQuery = useWordList();

  if (wordListQuery.isLoading || challengeQuery.isLoading) {
    return <DailyLoading />;
  }

  // const dailyData =
  //   challengeQuery?.data?.['palavreado'] ??
  const dailyData = {
    id: '',
    number: 0,
    type: 'palavreado',
    language: 'pt',
    text: sample(Object.values(wordListQuery.data ?? { troco: 'troço' })) || 'troço',
  } as DailyPalavreadoEntry;

  if (challengeQuery.isError || wordListQuery.isError) {
    return <DailyError />;
  }

  return (
    <DailyPalavreado data={dailyData} currentUser={currentUser} wordDictionary={wordListQuery.data ?? {}} />
  );
}
