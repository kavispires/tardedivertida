import './daily.scss';

import { Space } from 'antd';
import { PageError } from 'components/errors';
import { Loading } from 'components/loaders';
import { useCurrentUserContext } from 'hooks/useCurrentUserContext';
import { useLanguage } from 'hooks/useLanguage';
import { LoginModal } from 'pages/Me/components/LoginModal';
import { useLocation } from 'react-router-dom';
import { useEffectOnce, useTitle } from 'react-use';
import { isDevEnv } from 'utils/helpers';

import { DailyArteRuimGame } from './components/ArteRuim/DailyArteRuimGame';
import { DailyChrome } from './components/DailyChrome';
import { useDailyChallenge } from './useDaily';
import { getTitleName, getToday } from './utils';

function DailyPage() {
  const { isAuthenticated } = useCurrentUserContext();
  const { pathname } = useLocation();
  const { setLanguage } = useLanguage();
  useEffectOnce(() => {
    setLanguage(pathname === '/diario' ? 'pt' : 'en');
  });

  if (!isAuthenticated) {
    return (
      <DailyChrome>
        <LoginModal isAuthenticated={false} />
      </DailyChrome>
    );
  }

  return <DailyContent />;
}

function DailyContent() {
  const { currentUser } = useCurrentUserContext();
  const today = isDevEnv ? '2023-10-31' : getToday();
  // const today = getToday();
  const { language, translate } = useLanguage();
  useTitle(`${getTitleName(language)} - Tarde Divertida`);
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

export default DailyPage;
