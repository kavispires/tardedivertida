import './utils/daily.scss';

import { useCurrentUserContext } from 'hooks/useCurrentUserContext';
import { useLanguage } from 'hooks/useLanguage';
import { LoginModal } from 'pages/Me/components/LoginModal';
import { useLocation } from 'react-router-dom';
import { useEffectOnce } from 'react-use';

import { DailyArteRuimDataWrapper } from './games/ArteRuim/DailyArteRuimDataWrapper';
import { DailyChrome } from './components/DailyChrome';
import { Hub } from './games/Hub';
import { DailyAquiOGame } from './games/AquiO/DailyAquiOGame';

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
      'aqui-o': DailyAquiOGame,
      'arte-ruim': DailyArteRuimDataWrapper,
      hub: Hub,
    }?.[subPath] ?? DailyArteRuimDataWrapper;

  return <Outlet />;
}

export default DailyPage;
