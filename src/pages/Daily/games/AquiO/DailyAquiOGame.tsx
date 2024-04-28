import './utils/styles.scss';

import { useLanguage } from 'hooks/useLanguage';
import { DailyError } from 'pages/Daily/components/DailyError';
import { DailyLoading } from 'pages/Daily/components/DailyLoading';
import { useDailyAquiOChallenge } from 'pages/Daily/games/AquiO/data/useDailyAquiOChallenge';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';

import { getToday, wait } from '../../utils';
import { DailyAquiO } from './components/DailyAquiO';

export function DailyAquiOGame() {
  const today = getToday();
  const { language } = useLanguage();
  const { pathname } = useLocation();
  const [isRandomGame, setRandomGame] = useState(false);

  // Load challenge
  const challengeQuery = useDailyAquiOChallenge(`${today}`, pathname.substring(1), isRandomGame);

  if (challengeQuery.isLoading || challengeQuery.isRefetching) {
    return <DailyLoading />;
  }

  if (challengeQuery.isError) {
    return <DailyError />;
  }

  const onToggleGame = async () => {
    setRandomGame((prev) => !prev);
    await wait(250);
    challengeQuery.refetch();
  };

  return (
    <DailyAquiO
      data={challengeQuery.data}
      language={language}
      onToggleGame={onToggleGame}
      isRandomGame={isRandomGame}
    />
  );
}
