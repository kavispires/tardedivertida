import './utils/daily.scss';

import { useCurrentUserContext } from 'hooks/useCurrentUserContext';
import { useLanguage } from 'hooks/useLanguage';
import { LoginModal } from 'pages/Me/components/LoginModal';
import { useLocation } from 'react-router-dom';
import { useEffectOnce } from 'react-use';

import { DailyArteRuimDataWrapper } from './components/ArteRuim/DailyArteRuimDataWrapper';
import { DailyChrome } from './components/Common/DailyChrome';
import { Hub } from './components/Hub';
import { DailyAcheIssoDataWrapper } from './components/AquiO/DailyAcheIssoDataWrapper';

function DailyPage() {
  const { isAuthenticated } = useCurrentUserContext();
  const { pathname } = useLocation();
  const { setLanguage } = useLanguage();
  useEffectOnce(() => {
    setLanguage(pathname.includes('diario') ? 'pt' : 'en');
  });

  if (!isAuthenticated) {
    return (
      <DailyChrome>
        <LoginModal isAuthenticated={false} />
      </DailyChrome>
    );
  }

  const subPath = pathname.split('/')?.[2];

  const Outlet =
    {
      '': DailyArteRuimDataWrapper,
      'aqui-o': DailyAcheIssoDataWrapper,
      'ache-isso': DailyAcheIssoDataWrapper,
      'arte-ruim': DailyArteRuimDataWrapper,
      hub: Hub,
    }?.[subPath] ?? DailyArteRuimDataWrapper;

  return <Outlet />;
}

export default DailyPage;
