import { DailyError } from 'pages/Daily/components/DailyError';
import { DailyLoading } from 'pages/Daily/components/DailyLoading';
import { useRandomAquiOChallenge } from 'pages/Daily/games/AquiO/data/useRandomAquiOChallenge';
import { useDailyChallenge } from 'pages/Daily/hooks/useDailyChallenge';
import { useState } from 'react';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Internal
import { DailyAquiO } from './components/DailyAquiO';
import { getToday, wait } from '../../utils';
// Sass
import './utils/styles.scss';

export function DailyAquiOGame() {
  const today = getToday();
  const { language } = useLanguage();
  const [isRandomGame, setRandomGame] = useState(false);

  // Load challenge
  const challengeQuery = useDailyChallenge();
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
  };

  return (
    <DailyAquiO data={data} language={language} onToggleGame={onToggleGame} isRandomGame={isRandomGame} />
  );
}
