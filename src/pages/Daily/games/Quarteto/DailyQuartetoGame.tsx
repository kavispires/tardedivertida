import './utils/styles.scss';

import { useCurrentUserContext } from 'hooks/useCurrentUserContext';
import { DailyError } from 'pages/Daily/components/DailyError';
import { DailyLoading } from 'pages/Daily/components/DailyLoading';

import { useDailyChallenge } from '../../hooks/useDailyChallenge';
import { getToday } from '../../utils';
import { DailyQuarteto } from './components/DailyQuarteto';
import { DailyQuartetoEntry } from './utils/types';
import { shuffle } from 'lodash';

export function DailyQuartetoGame() {
  const { currentUser } = useCurrentUserContext();
  const today = getToday();

  // Load challenge
  const challengeQuery = useDailyChallenge(`${today}`);

  if (challengeQuery.isLoading) {
    return <DailyLoading />;
  }

  const dailyData: DailyQuartetoEntry = challengeQuery?.data?.['quarteto'] ?? {
    id: today,
    number: 0,
    type: 'quarteto',
    setId: '',
    itemsIds: [
      '1250',
      '2276',
      '1478',
      '775',
      '49',
      '2230',
      '1252',
      '2277',
      '1434',
      '128',
      '786',
      '1147',
      '189',
      '134',
      '2229',
      '524',
    ],
    keys: [
      {
        title: 'Bolas de Esportes',
        itemsIds: ['189', '524', '786', '1478'],
      },
      {
        title: 'Vai no pulso',
        itemsIds: ['49', '1147', '1434', '1250'],
      },
      {
        title: 'Refrescante',
        itemsIds: ['128', '134', '775', '1252'],
      },
      {
        title: 'Expressões',
        itemsIds: ['2276', '2277', '2229', '2230'],
      },
    ],
    items: {},
  };

  if (challengeQuery.isError || !dailyData) {
    return <DailyError />;
  }

  return <DailyQuarteto data={dailyData} currentUser={currentUser} />;
}
