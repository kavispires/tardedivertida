import './utils/daily.scss';

import { useCurrentUserContext } from 'hooks/useCurrentUserContext';
import { useLanguage } from 'hooks/useLanguage';
import { LoginModal } from 'pages/Me/components/LoginModal';
import { useLocation } from 'react-router-dom';
import { useEffectOnce, useTitle } from 'react-use';

import { DailyArteRuimGame } from './games/ArteRuim/DailyArteRuimGame';
import { DailyChrome } from './components/DailyChrome';
import { Hub } from './games/Hub';
import { DailyAquiOGame } from './games/AquiO/DailyAquiOGame';
import { getDailyName } from './utils';
import { DailyPalavreadoGame } from './games/Palavreado/DailyPalavreadoGame';
import { DailyArtistaGame } from './games/Artista/DailyArtistaGame';
import { DailyFilmacoGame } from './games/Filmaco/DailyFilmacoGame';
import { DailyControleDeEstoqueGame } from './games/ControleDeEstoque/DailyControleDeEstoqueGame';
import { DebugPage } from './games/Debug';
import { DailyTeoriaDeConjuntosGame } from './games/TeoriaDeConjuntos/DailyTeoriaDeConjuntosGame';

function DailyPage() {
  const { isAuthenticated } = useCurrentUserContext();
  const { pathname } = useLocation();
  const { setLanguage, language } = useLanguage();

  useEffectOnce(() => {
    setLanguage(pathname.includes('diario') ? 'pt' : 'en');
  });

  const subPath = pathname.split('/')?.[2];

  useTitle(`${getDailyName(language)} - Tarde Divertida`);

  if (!isAuthenticated) {
    return (
      <DailyChrome>
        <LoginModal isAuthenticated={false} />
      </DailyChrome>
    );
  }

  const Outlet =
    {
      '': Hub,
      'aqui-o': DailyAquiOGame,
      'arte-ruim': DailyArteRuimGame,
      'controle-de-estoque': DailyControleDeEstoqueGame,
      filmaco: DailyFilmacoGame,
      hub: Hub,
      palavreado: DailyPalavreadoGame,
      picaco: DailyArtistaGame,
      'teoria-de-conjuntos': DailyTeoriaDeConjuntosGame,
      debug: DebugPage,
    }?.[subPath] ?? Hub;

  return <Outlet />;
}

export default DailyPage;
