import { LoginModal } from 'pages/Me/components/LoginModal';
import { useLocation } from 'react-router-dom';
import { useEffectOnce, useTitle } from 'react-use';
// Hooks
import { useCurrentUserContext } from 'hooks/useCurrentUserContext';
import { useLanguage } from 'hooks/useLanguage';
// Internal
import { DailyChrome } from './components/DailyChrome';
import { DailyAquiOGame } from './games/AquiO/DailyAquiOGame';
import { DailyArteRuimGame } from './games/ArteRuim/DailyArteRuimGame';
import { DailyControleDeEstoqueGame } from './games/ControleDeEstoque/DailyControleDeEstoqueGame';
import { DebugPage } from './games/Debug';
import { DailyFilmacoGame } from './games/Filmaco/DailyFilmacoGame';
import { Hub } from './games/Hub';
import { DailyPalavreadoGame } from './games/Palavreado/DailyPalavreadoGame';
import { DailyPicacoGame } from './games/Picaco/DailyPicacoGame';
import { DailyTeoriaDeConjuntosGame } from './games/TeoriaDeConjuntos/DailyTeoriaDeConjuntosGame';
import { getDailyName } from './utils';
import { DailyContextProvider } from './hooks/useDailyChallenge';
import { DailyComunicacaoAlienigenaGame } from './games/ComunicacaoAlienigena/DailyComunicacaoAlienigenaGame';
import { DailyPortaisMagicosGame } from './games/PortaisMagicos/DailyPortaisMagicosGame';
import { DailyQuartetosGame } from './games/Quartetos/DailyQuartetosGame';
// Sass
import './utils/daily.scss';

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
      <DailyContextProvider>
        <DailyChrome>
          <LoginModal isAuthenticated={false} />
        </DailyChrome>
      </DailyContextProvider>
    );
  }

  const Outlet =
    {
      // Hub
      '': Hub,
      hub: Hub,
      // Games
      'aqui-o': DailyAquiOGame,
      'arte-ruim': DailyArteRuimGame,
      'comunicacao-alienigena': DailyComunicacaoAlienigenaGame,
      'controle-de-estoque': DailyControleDeEstoqueGame,
      filmaco: DailyFilmacoGame,
      palavreado: DailyPalavreadoGame,
      'teoria-de-conjuntos': DailyTeoriaDeConjuntosGame,
      // Contribute
      picaco: DailyPicacoGame,
      // Demos
      'portais-magicos': DailyPortaisMagicosGame,
      quartetos: DailyQuartetosGame,
      // Dev
      debug: DebugPage,
    }?.[subPath] ?? Hub;

  return (
    <DailyContextProvider>
      <Outlet />
    </DailyContextProvider>
  );
}

export default DailyPage;
