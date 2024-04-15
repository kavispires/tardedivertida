import { Space } from 'antd';
import { PageError } from 'components/errors';
import { Loading } from 'components/loaders';
import { useLanguage } from 'hooks/useLanguage';
import { useDailyAcheIssoChallenge } from 'pages/Daily/hooks/useDailyAcheIssoChallenge';
import { useLocation } from 'react-router-dom';
import { useTitle } from 'react-use';
import { isDevEnv } from 'utils/helpers';

import { getTitleName, getToday } from '../../utils';
import { DailyChrome } from '../Common/DailyChrome';
import { DailyAcheIsso } from './DailyAcheIsso';

export function DailyAcheIssoDataWrapper() {
  const today = isDevEnv ? '2023-10-31' : getToday();
  // const today = getToday();
  const { language, translate } = useLanguage();
  useTitle(`${getTitleName(language)} - Tarde Divertida`);
  const { pathname } = useLocation();

  // Load challenge
  const challengeQuery = useDailyAcheIssoChallenge(`${today}`, pathname.substring(1));

  if (challengeQuery.isLoading) {
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

  const daily = challengeQuery.data;

  return <DailyAcheIsso data={daily} language={language} />;
}
