import './utils/styles.scss';

import { useLanguage } from 'hooks/useLanguage';
import { DailyError } from 'pages/Daily/components/DailyError';
import { DailyLoading } from 'pages/Daily/components/DailyLoading';
import { useRandomAquiOChallenge } from 'pages/Daily/games/AquiO/data/useRandomAquiOChallenge';
import { useState } from 'react';

import { getToday, wait } from '../../utils';
import { DailyAquiO } from './components/DailyAquiO';
import { useDailyChallenge } from 'pages/Daily/hooks/useDailyChallenge';

export function DailyAquiOGame() {
  const today = getToday();
  const { language } = useLanguage();
  const [isRandomGame, setRandomGame] = useState(false);

  // Load challenge
  const challengeQuery = useDailyChallenge(`${today}`);
  const randomGameQuery = useRandomAquiOChallenge(`${today}`);

  if (challengeQuery.isLoading || challengeQuery.isRefetching || randomGameQuery.isLoading) {
    return <DailyLoading />;
  }

  const dailyData = challengeQuery?.data?.['aqui-o'];
  const data = isRandomGame ? randomGameQuery?.data : dailyData;

  if (challengeQuery.isError || !data) {
    return <DailyError />;
  }

  const onToggleGame = async () => {
    setRandomGame((prev) => !prev);
    await wait(250);
    challengeQuery.refetch();
  };

  return (
    <DailyAquiO data={data} language={language} onToggleGame={onToggleGame} isRandomGame={isRandomGame} />
  );
}
