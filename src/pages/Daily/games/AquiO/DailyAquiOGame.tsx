import './utils/styles.scss';

import { PageError } from 'components/errors';
import { useLanguage } from 'hooks/useLanguage';
import { useDailyAquiOChallenge } from 'pages/Daily/games/AquiO/data/useDailyAquiOChallenge';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';

import { DailyChrome } from '../../components/DailyChrome';
import { getToday, wait } from '../../utils';
import { DailyAquiO } from './components/DailyAquiO';
import { DailyLoading } from 'pages/Daily/components/DailyLoading';

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
    return (
      <DailyChrome>
        <PageError />
      </DailyChrome>
    );
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
