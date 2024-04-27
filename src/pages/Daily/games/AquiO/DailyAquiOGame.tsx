import './utils/styles.scss';

import { Space } from 'antd';
import { PageError } from 'components/errors';
import { Loading } from 'components/loaders';
import { useLanguage } from 'hooks/useLanguage';
import { useDailyAquiOChallenge } from 'pages/Daily/games/AquiO/data/useDailyAquiOChallenge';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTitle } from 'react-use';

import { DailyChrome } from '../../components/DailyChrome';
import { getDailyName, getToday, wait } from '../../utils';
import { DailyAquiO } from './components/DailyAquiO';

export function DailyAquiOGame() {
  const today = getToday();
  // const today = getToday();
  const { language, translate } = useLanguage();
  useTitle(`${getDailyName(language)} - Tarde Divertida`);
  const { pathname } = useLocation();
  const [isRandomGame, setRandomGame] = useState(false);

  // Load challenge
  const challengeQuery = useDailyAquiOChallenge(`${today}`, pathname.substring(1), isRandomGame);

  if (challengeQuery.isLoading || challengeQuery.isRefetching) {
    return (
      <DailyChrome>
        <div className="daily-loading">
          <Space className="space-container">
            <Loading message={translate('Carregando desafio...', 'Loading challenge...')} margin />
          </Space>
        </div>
      </DailyChrome>
    );
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
