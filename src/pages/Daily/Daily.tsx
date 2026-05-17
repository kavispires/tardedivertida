import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTitle } from 'react-use';
// Hooks
import { useCurrentUserContext } from 'hooks/useCurrentUserContext';
import { useLanguage } from 'hooks/useLanguage';
// Pages
import { LoginModal } from 'pages/Me/components/LoginModal';
// Internal
import { DailyChrome } from './components/DailyChrome';
import { DailyAquiOGame } from './games/AquiO/DailyAquiOGame';
import { DailyArteRuimGame } from './games/ArteRuim/DailyArteRuimGame';
import { DailyAlienadoGame } from './games/Alienado/DailyAlienadoGame';
import { DailyEstoquistaGame } from './games/Estoquista/DailyEstoquistaGame';
import { DebugPage } from './Debug';
import { DailyFilmacoGame } from './games/Filmaco/DailyFilmacoGame';
import { Hub } from './Hub';
import { DailyPalavreadoGame } from './games/Palavreado/DailyPalavreadoGame';
import { DailyPicacoGame } from './games/Picaco/DailyPicacoGame';
import { DailyConjuntosGame } from './games/Conjuntos/DailyConjuntosGame';
import { getDailyName } from './utils';
import { DailyContextProvider } from './hooks/useDailyChallenge';
import { DailyPortaisGame } from './games/Portais/DailyPortaisGame';
import { DailyQuartetosGame } from './games/Quartetos/DailyQuartetosGame';
import { DailyTaNaCaraGame } from './games/TaNaCara/DailyTaNaCaraGame';
import { DailyConexoesGame } from './games/Conexoes/DailyConexoesGame';
import { DailyInvestigacaoGame } from './games/Investigacao/DailyInvestigacaoGame';
import { DailyOrganikuGame } from './games/Organiku/DailyOrganikuGame';
import { DailyVitralGame } from './games/Vitral/DailyVitralGame';
import { DailyDemoPage } from './games/Demo/DailyDemoPage';
import { VitraisInfinitosGame } from './games/VitraisInfinitos/VitraisInfinitosGame';
import { DailyMapeamentoGame } from './games/Mapeamento/DailyMapeamentoGame';
import { DailyPanicoGame } from './games/Panico/DailyPanicoGame';
import { DailyPirralhosGame } from './games/Pirralhos/DailyPirralhosGame';
// Sass
import './utils/daily.scss';

function DailyPage() {
  const { isAuthenticated } = useCurrentUserContext();
  const { pathname } = useLocation();
  const { setLanguage, language } = useLanguage();

  // biome-ignore lint/correctness/useExhaustiveDependencies: function is not a dependency
  useEffect(() => {
    if (language !== 'pt') {
      // Set the language to Portuguese if it's not
      setLanguage('pt');
    }
  }, [language]);

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
      alienado: DailyAlienadoGame,
      'aqui-o': DailyAquiOGame,
      'arte-ruim': DailyArteRuimGame,
      conjuntos: DailyConjuntosGame,
      estoquista: DailyEstoquistaGame,
      investigacao: DailyInvestigacaoGame,
      filmaco: DailyFilmacoGame,
      mapeamento: DailyMapeamentoGame,
      organiku: DailyOrganikuGame,
      palavreado: DailyPalavreadoGame,
      pirralhos: DailyPirralhosGame,
      panico: DailyPanicoGame,
      portais: DailyPortaisGame,
      quartetos: DailyQuartetosGame,
      vitral: DailyVitralGame,
      // Contribute
      conexoes: DailyConexoesGame,
      picaco: DailyPicacoGame,
      'ta-na-cara': DailyTaNaCaraGame,
      demo: DailyDemoPage,
      // Endless games
      'vitrais-infinitos': VitraisInfinitosGame,
      // TODO
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
