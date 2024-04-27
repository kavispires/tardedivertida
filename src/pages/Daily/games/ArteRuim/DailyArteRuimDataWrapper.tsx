import { Space } from 'antd';
import { PageError } from 'components/errors';
import { Loading } from 'components/loaders';
import { useCurrentUserContext } from 'hooks/useCurrentUserContext';
import { useLanguage } from 'hooks/useLanguage';
import { useLocation } from 'react-router-dom';
import { useTitle } from 'react-use';

import { DailyChrome } from '../../components/DailyChrome';
import { useDailyChallenge } from '../../hooks/useDailyChallenge';
import { getDailyName, getToday } from '../../utils';
import { DailyArteRuimGame } from './DailyArteRuimGame';

export function DailyArteRuimDataWrapper() {
  const { currentUser } = useCurrentUserContext();
  const today = getToday();
  const { language, translate } = useLanguage();
  useTitle(`${getDailyName(language)} - Tarde Divertida`);
  const { pathname } = useLocation();

  // Load challenge
  const challengeQuery = useDailyChallenge(`${today}`, pathname.substring(1));

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

  const daily = challengeQuery.data.data;

  return <DailyArteRuimGame data={daily} currentUser={currentUser} language={language} />;
}
